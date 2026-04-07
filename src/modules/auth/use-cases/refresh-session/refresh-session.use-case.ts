import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import type { UsersRepositoryInterface } from '@/modules/users/models/interfaces/users-repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '@/modules/users/shared/constants/repository-interface-key';
import { env } from '@/shared/constants/env-variables';
import { InvalidRefreshTokenException } from '../../errors/invalid-refresh-token.error';
import type { SessionUser } from '../../models/interfaces/session-user.interface';
import { destroySession, getSessionUser, saveSession } from '../../shared/helpers/session.helper';

@Injectable()
export class RefreshSessionUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
	) {}

	async execute(request: Request): Promise<SessionUser> {
		let currentSession: SessionUser;
		try {
			currentSession = getSessionUser(request);
		} catch {
			throw new InvalidRefreshTokenException();
		}

		const user = await this.usersRepository.findOne({
			where: { id: currentSession.userId },
		});

		if (!user) {
			await destroySession(request);
			throw new InvalidRefreshTokenException();
		}

		const activeMembership = currentSession.activeOrganizationId
			? await this.getExistingOrganizationMemberUseCase.execute(
					{
						where: {
							user_id: user.id,
							organization_id: currentSession.activeOrganizationId,
							active: true,
						},
					},
					{ throwIfFound: false, throwIfNotFound: false },
				)
			: null;

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
