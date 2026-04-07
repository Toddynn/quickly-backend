import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from '@/shared/constants/env-variables';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CreateAccessTokenController } from './use-cases/create-access-token/create-access-token.controller';
import { CreateAccessTokenUseCase } from './use-cases/create-access-token/create-access-token.use-case';
import { LogoutController } from './use-cases/logout/logout.controller';
import { LogoutUseCase } from './use-cases/logout/logout.use-case';
import { RefreshTokenController } from './use-cases/refresh-token/refresh-token.controller';
import { RefreshTokenUseCase } from './use-cases/refresh-token/refresh-token.use-case';
import { SwitchOrganizationController } from './use-cases/switch-organization/switch-organization.controller';
import { SwitchOrganizationUseCase } from './use-cases/switch-organization/switch-organization.use-case';

@Module({
	imports: [
		UsersModule,
		OrganizationMembersModule,
		PassportModule,
		JwtModule.register({
			secret: env.JWT_SECRET,
			signOptions: { expiresIn: env.JWT_EXPIRES_IN },
		}),
	],
	controllers: [CreateAccessTokenController, RefreshTokenController, LogoutController, SwitchOrganizationController],
	providers: [JwtStrategy, CreateAccessTokenUseCase, RefreshTokenUseCase, LogoutUseCase, SwitchOrganizationUseCase],
})
export class AuthModule {}
