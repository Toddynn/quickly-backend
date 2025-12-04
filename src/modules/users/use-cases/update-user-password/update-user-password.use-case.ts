import { Inject, Injectable } from '@nestjs/common';
import type { UpdateResult } from 'typeorm';
import { hashPassword } from '@/shared/helpers/hash-password.helper';
import { UpdateUserUseCase } from '../update-user/update-user.use-case';

@Injectable()
export class UpdateUserPasswordUseCase {
	constructor(
		@Inject(UpdateUserUseCase)
		private readonly updateUserUseCase: UpdateUserUseCase,
	) {}

	async execute(userId: string, newPassword: string): Promise<UpdateResult> {
		const passwordHash = await hashPassword(newPassword);

		return await this.updateUserUseCase.execute(userId, { password: passwordHash });
	}
}
