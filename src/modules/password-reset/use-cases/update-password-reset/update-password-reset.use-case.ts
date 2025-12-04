import { Inject, Injectable } from '@nestjs/common';
import type { UpdatePasswordResetDto } from '../../models/dto/input/update-password-reset.dto';
import type { PasswordResetRepositoryInterface } from '../../models/interfaces/password-reset-repository.interface';
import { PASSWORD_RESET_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/password-reset-repository-interface-key';

@Injectable()
export class UpdatePasswordResetUseCase {
	constructor(
		@Inject(PASSWORD_RESET_REPOSITORY_INTERFACE_KEY)
		private readonly passwordResetRepository: PasswordResetRepositoryInterface,
	) {}

	async execute(passwordResetId: string, updatePasswordResetDto: UpdatePasswordResetDto): Promise<void> {
		await this.passwordResetRepository.update(passwordResetId, updatePasswordResetDto);
	}
}
