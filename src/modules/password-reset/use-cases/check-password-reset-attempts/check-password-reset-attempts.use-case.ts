import { Inject, Injectable } from '@nestjs/common';
import { In, MoreThanOrEqual } from 'typeorm';
import { PasswordResetAttemptsExceededException } from '../../errors/password-reset-attempts-exceeded.error';
import type { PasswordResetRepositoryInterface } from '../../models/interfaces/password-reset-repository.interface';
import { PASSWORD_RESET_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/password-reset-repository-interface-key';
import { PASSWORD_RESET_STATUS } from '../../shared/interfaces/password-reset-status';

@Injectable()
export class CheckPasswordResetAttemptsUseCase {
	private static readonly MAX_ATTEMPTS = 3;
	private static readonly ATTEMPT_WINDOW_HOURS = 24;

	constructor(
		@Inject(PASSWORD_RESET_REPOSITORY_INTERFACE_KEY)
		private readonly passwordResetRepository: PasswordResetRepositoryInterface,
	) {}

	async execute(userId: string): Promise<void> {
		const oneDayAgo = new Date();
		oneDayAgo.setHours(oneDayAgo.getHours() - CheckPasswordResetAttemptsUseCase.ATTEMPT_WINDOW_HOURS);

		const attemptsCount = await this.passwordResetRepository.count({
			where: {
				user_id: userId,
				status: In([PASSWORD_RESET_STATUS.EXPIRED, PASSWORD_RESET_STATUS.USED]),
				created_at: MoreThanOrEqual(oneDayAgo),
			},
		});

		if (attemptsCount >= CheckPasswordResetAttemptsUseCase.MAX_ATTEMPTS) {
			throw new PasswordResetAttemptsExceededException(
				CheckPasswordResetAttemptsUseCase.MAX_ATTEMPTS,
				CheckPasswordResetAttemptsUseCase.ATTEMPT_WINDOW_HOURS,
			);
		}
	}
}
