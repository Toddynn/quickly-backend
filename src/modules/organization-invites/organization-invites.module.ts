import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';
import { OrganizationInvite } from './models/entities/organization-invite.entity';
import { OrganizationInvitesRepository } from './repository/organization-invites.repository';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { AcceptOrganizationInviteController } from './use-cases/accept-organization-invite/accept-organization-invite.controller';
import { AcceptOrganizationInviteUseCase } from './use-cases/accept-organization-invite/accept-organization-invite.use-case';
import { CancelOrganizationInviteController } from './use-cases/cancel-organization-invite/cancel-organization-invite.controller';
import { CancelOrganizationInviteUseCase } from './use-cases/cancel-organization-invite/cancel-organization-invite.use-case';
import { CreateOrganizationInviteController } from './use-cases/create-organization-invite/create-organization-invite.controller';
import { CreateOrganizationInviteUseCase } from './use-cases/create-organization-invite/create-organization-invite.use-case';
import { GetExistingOrganizationInviteUseCase } from './use-cases/get-existing-organization-invite/get-existing-organization-invite.use-case';
import { ListOrganizationInvitesController } from './use-cases/list-organization-invites/list-organization-invites.controller';
import { ListOrganizationInvitesUseCase } from './use-cases/list-organization-invites/list-organization-invites.use-case';
import { RejectOrganizationInviteController } from './use-cases/reject-organization-invite/reject-organization-invite.controller';
import { RejectOrganizationInviteUseCase } from './use-cases/reject-organization-invite/reject-organization-invite.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([OrganizationInvite]), OrganizationMembersModule],
	controllers: [
		CreateOrganizationInviteController,
		AcceptOrganizationInviteController,
		RejectOrganizationInviteController,
		CancelOrganizationInviteController,
		ListOrganizationInvitesController,
	],
	providers: [
		{
			provide: ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new OrganizationInvitesRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingOrganizationInviteUseCase,
		CreateOrganizationInviteUseCase,
		AcceptOrganizationInviteUseCase,
		RejectOrganizationInviteUseCase,
		CancelOrganizationInviteUseCase,
		ListOrganizationInvitesUseCase,
	],
	exports: [ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY],
})
export class OrganizationInvitesModule {}
