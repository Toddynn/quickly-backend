import { Inject, Injectable } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { UpdateResult } from 'typeorm';
import { destroySessionByIdAndClearCookie } from '@/modules/auth/shared/helpers/session.helper';
import { hashPassword } from '@/shared/helpers/hash-password.helper';
import type { UsersRepositoryInterface } from '../../models/interfaces/users-repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingUserUseCase } from '../get-existing-user/get-existing-user.use-case';

@Injectable()
export class UpdateUserPasswordUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
	) {}

	async execute(userId: string, newPassword: string, request?: Request, response?: Response): Promise<UpdateResult> {
		const user = await this.getExistingUserUseCase.execute({ where: { id: userId } });

		const passwordHash = await hashPassword(newPassword);

		const updatedUser = await this.usersRepository.update(user.id, { password: passwordHash });

		if (updatedUser.affected && updatedUser.affected > 0 && request?.sessionID && response) {
			await destroySessionByIdAndClearCookie(request, response, request.sessionID);
		}

		return updatedUser;
	}
}
