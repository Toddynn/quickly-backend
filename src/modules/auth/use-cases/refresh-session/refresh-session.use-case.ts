import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { InvalidRefreshTokenException } from '../../errors/invalid-refresh-token.error';
import type { SessionUser } from '../../models/interfaces/session-user.interface';
import { alignAuthenticatedSessionExpiry, destroySession, getSessionUser, saveSession } from '../../shared/helpers/session.helper';

@Injectable()
export class RefreshSessionUseCase {
	constructor(
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
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

		const user = await this.getExistingUserUseCase.execute(
			{
				where: { id: currentSession.userId },
			},
			{ throwIfFound: false, throwIfNotFound: false },
		);

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

		request.session.userId = user.id;
		request.session.email = user.email;
		request.session.activeOrganizationId = activeMembership?.organization_id ?? null;
		request.session.organizationRole = activeMembership?.role ?? null;

		if (!alignAuthenticatedSessionExpiry(request)) {
			await destroySession(request);
			throw new InvalidRefreshTokenException();
		}

		await saveSession(request);

		return {
			userId: user.id,
			email: user.email,
			activeOrganizationId: activeMembership?.organization_id ?? null,
			organizationRole: activeMembership?.role ?? null,
		};
	}
}
