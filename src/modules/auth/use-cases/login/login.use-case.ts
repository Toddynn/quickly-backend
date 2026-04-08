import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import type { UsersRepositoryInterface } from '@/modules/users/models/interfaces/users-repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '@/modules/users/shared/constants/repository-interface-key';
import { comparePassword } from '@/shared/helpers/hash-password.helper';
import { InvalidCredentialsException } from '../../errors/invalid-credentials.error';
import type { LoginDto } from '../../models/dto/input/login.dto';
import type { SessionUser } from '../../models/interfaces/session-user.interface';
import { alignAuthenticatedSessionExpiry, saveSession } from '../../shared/helpers/session.helper';

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

		request.session.userId = user.id;
		request.session.email = user.email;
		request.session.activeOrganizationId = activeMembership?.organization_id ?? null;
		request.session.organizationRole = activeMembership?.role ?? null;
		request.session.rememberMe = loginDto.rememberMe === true;
		request.session.sessionStartedAt = Date.now();

		alignAuthenticatedSessionExpiry(request);

		await saveSession(request);

		return {
			userId: user.id,
			email: user.email,
			activeOrganizationId: activeMembership?.organization_id ?? null,
			organizationRole: activeMembership?.role ?? null,
		};
	}
}
