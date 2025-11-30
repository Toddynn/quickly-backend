import { BadRequestException, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { hashPassword } from '@/shared/helpers/hash-password.helper';
import type { ResetPasswordDto } from '../../models/dto/reset-password.dto';
import { User } from '../../models/entities/user.entity';
import { PASSWORD_RESET_STATUS } from '../../shared/constants/password-reset-status';
import { GetExistingPasswordResetUseCase } from '../get-existing-password-reset/get-existing-password-reset.use-case';
import { GetExistingUserUseCase } from '../get-existing-user/get-existing-user.use-case';

@Injectable()
export class ResetPasswordUseCase {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingPasswordResetUseCase)
		private readonly getExistingPasswordResetUseCase: GetExistingPasswordResetUseCase,
	) {}

	async execute(resetPasswordDto: ResetPasswordDto): Promise<void> {
		const user = await this.getExistingUserUseCase.execute({
			where: { email: resetPasswordDto.email },
		}, {throwIfNotFound: false});

		if (!user) {
			throw new BadRequestException('Email inválido.');
		}

		const passwordReset = await this.getExistingPasswordResetUseCase.execute({
			where: {
				user_id: user.id,
				status: PASSWORD_RESET_STATUS.PENDING,
				validated: true,
			},
		});

		if (!passwordReset) {
			throw new BadRequestException('Nenhum código OTP validado encontrado. Por favor, valide o código OTP primeiro.');
		}

		// Verifica se o OTP expirou
		const expirationDate = new Date(passwordReset.expiration_date);
		if (expirationDate < new Date()) {
			const queryRunner = this.dataSource.createQueryRunner();
			await queryRunner.connect();
			await queryRunner.startTransaction();

			try {
				await queryRunner.manager.update('password_resets', passwordReset.id, {
					status: PASSWORD_RESET_STATUS.EXPIRED,
				});

				await queryRunner.commitTransaction();
			} catch (error) {
				await queryRunner.rollbackTransaction();
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
			} finally {
				await queryRunner.release();
			}

			throw new BadRequestException('Código OTP expirado.');
		}

		// Gera hash da nova senha
		const passwordHash = await hashPassword(resetPasswordDto.new_password);

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Atualiza a senha do usuário
			await queryRunner.manager.update(User, user.id, { password: passwordHash });

			// Marca o OTP como usado
			await queryRunner.manager.update('password_resets', passwordReset.id, {
				status: PASSWORD_RESET_STATUS.USED,
			});

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}
}

