import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';

@Injectable()
export class MarkPasswordResetAsUsedUseCase {
	constructor(
		@Inject(DataSource)
		private readonly dataSource: DataSource,
	) {}

	async execute(passwordResetId: string): Promise<void> {
		const queryRunner = this.dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			await queryRunner.manager.update('password_resets', passwordResetId, {
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

