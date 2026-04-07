import { createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import type { UsersRepositoryInterface } from '@/modules/users/models/interfaces/users-repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '@/modules/users/shared/constants/repository-interface-key';
import { env } from '@/shared/constants/env-variables';
import { comparePassword } from '@/shared/helpers/hash-password.helper';
import { InvalidCredentialsException } from '../../errors/invalid-credentials.error';
import type { LoginDto } from '../../models/dto/input/login.dto';
import type { AuthTokensDto } from '../../models/dto/output/auth-tokens.dto';
import type { JwtPayload } from '../../strategies/jwt.strategy';

@Injectable()
export class CreateAccessTokenUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
		@Inject(JwtService)
		private readonly jwtService: JwtService,
	) {}

	async execute(loginDto: LoginDto): Promise<AuthTokensDto> {
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

		const payload: JwtPayload = {
			sub: user.id,
			email: user.email,
			active_organization_id: activeMembership?.organization_id ?? null,
			organization_role: activeMembership?.role ?? null,
		};

		const access_token = this.jwtService.sign(payload);
		const refresh_token = this.jwtService.sign(payload, {
			secret: env.JWT_REFRESH_SECRET,
			expiresIn: env.JWT_REFRESH_EXPIRES_IN,
		});

		const refresh_token_hash = createHash('sha256').update(refresh_token).digest('hex');
		await this.usersRepository.update(user.id, { refresh_token_hash });

		return { access_token, refresh_token };
	}
}
