import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import type { UsersRepositoryInterface } from '@/modules/users/models/interfaces/users-repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '@/modules/users/shared/constants/repository-interface-key';
import { env } from '@/shared/constants/env-variables';
import { comparePassword } from '@/shared/helpers/hash-password.helper';
import { InvalidCredentialsException } from '../../errors/invalid-credentials.error';
import type { LoginDto } from '../../models/dto/input/login.dto';
import type { SessionUser } from '../../models/interfaces/session-user.interface';
import { saveSession } from '../../shared/helpers/session.helper';

@Injectable()
export class LoginUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
	) {}

	async execute(request: Request, loginDto: LoginDto): Promise<SessionUser> {
		const user = await this.usersRepository
			.createQueryBuilder('user')
			.addSelect('user.password')
			.where('user.email = :email', { email: loginDto.email })
			.getOne();

		if (!user) {
			throw new InvalidCredentialsException();
		}

		const isPasswordValid = await comparePassword(loginDto.password, user.password);
		if (!isPasswordValid) {
			throw new InvalidCredentialsException();
		}

		const activeMembership = await this.getExistingOrganizationMemberUseCase.execute(
			{
				where: { user_id: user.id, active: true },
				order: { created_at: 'ASC' },
			},
			{ throwIfFound: false, throwIfNotFound: false },
		);

		const sessionMaxAgeMs = env.REDIS_TTL * 1000;
		request.session.cookie.maxAge = sessionMaxAgeMs;
		request.session.cookie.expires = new Date(Date.now() + sessionMaxAgeMs);

		request.session.userId = user.id;
		request.session.email = user.email;
		request.session.activeOrganizationId = activeMembership?.organization_id ?? null;
		request.session.organizationRole = activeMembership?.role ?? null;

		await saveSession(request);

		return {
			userId: user.id,
			email: user.email,
			activeOrganizationId: activeMembership?.organization_id ?? null,
			organizationRole: activeMembership?.role ?? null,
		};
	}
}
