import { createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import type { UsersRepositoryInterface } from '@/modules/users/models/interfaces/users-repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '@/modules/users/shared/constants/repository-interface-key';
import { env } from '@/shared/constants/env-variables';
import { NotMemberOfOrganizationException } from '../../errors/not-member-of-organization.error';
import type { SwitchOrganizationDto } from '../../models/dto/input/switch-organization.dto';
import type { AuthTokensDto } from '../../models/dto/output/auth-tokens.dto';
import type { JwtPayload } from '../../strategies/jwt.strategy';

@Injectable()
export class SwitchOrganizationUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
		@Inject(JwtService)
		private readonly jwtService: JwtService,
	) {}

	async execute(currentUser: JwtPayload, switchDto: SwitchOrganizationDto): Promise<AuthTokensDto> {
		const membership = await this.getExistingOrganizationMemberUseCase.execute(
			{
				where: {
					user_id: currentUser.sub,
					organization_id: switchDto.organization_id,
					active: true,
				},
			},
			{ throwIfFound: false, throwIfNotFound: false },
		);

		if (!membership) {
			throw new NotMemberOfOrganizationException();
		}

		const payload: JwtPayload = {
			sub: currentUser.sub,
			email: currentUser.email,
			active_organization_id: membership.organization_id,
			organization_role: membership.role,
		};

		const access_token = this.jwtService.sign(payload);
		const refresh_token = this.jwtService.sign(payload, {
			secret: env.JWT_REFRESH_SECRET,
			expiresIn: env.JWT_REFRESH_EXPIRES_IN,
		});

		const refresh_token_hash = createHash('sha256').update(refresh_token).digest('hex');
		await this.usersRepository.update(currentUser.sub, { refresh_token_hash });

		return { access_token, refresh_token };
	}
}
