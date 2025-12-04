import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { hashPassword } from '@/shared/helpers/hash-password.helper';
import { User } from '../../models/entities/user.entity';

@Injectable()
export class UpdateUserPasswordUseCase {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {}

	async execute(userId: string, newPassword: string): Promise<void> {
		// Gera hash da nova senha
		const passwordHash = await hashPassword(newPassword);

		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			// Atualiza a senha do usuário
			await queryRunner.manager.update(User, userId, { password: passwordHash });

			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		} finally {
			await queryRunner.release();
		}
	}
}
