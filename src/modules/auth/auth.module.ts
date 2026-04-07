import { Module } from '@nestjs/common';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';
import { UsersModule } from '../users/users.module';
import { LoginController } from './use-cases/login/login.controller';
import { LoginUseCase } from './use-cases/login/login.use-case';
import { LogoutController } from './use-cases/logout/logout.controller';
import { LogoutUseCase } from './use-cases/logout/logout.use-case';
import { RefreshSessionController } from './use-cases/refresh-session/refresh-session.controller';
import { RefreshSessionUseCase } from './use-cases/refresh-session/refresh-session.use-case';
import { SwitchOrganizationController } from './use-cases/switch-organization/switch-organization.controller';
import { SwitchOrganizationUseCase } from './use-cases/switch-organization/switch-organization.use-case';

@Module({
	imports: [UsersModule, OrganizationMembersModule],
	controllers: [LoginController, RefreshSessionController, LogoutController, SwitchOrganizationController],
	providers: [LoginUseCase, RefreshSessionUseCase, LogoutUseCase, SwitchOrganizationUseCase],
})
export class AuthModule {}
