import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrganizationMember } from './models/entities/organization-member.entity';
import { OrganizationMembersRepository } from './repository/organization-members.repository';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { ActivateOrganizationMemberController } from './use-cases/activate-organization-member/activate-organization-member.controller';
import { ActivateOrganizationMemberUseCase } from './use-cases/activate-organization-member/activate-organization-member.use-case';
import { CreateOrganizationMemberController } from './use-cases/create-organization-member/create-organization-member.controller';
import { CreateOrganizationMemberUseCase } from './use-cases/create-organization-member/create-organization-member.use-case';
import { GetExistingOrganizationMemberUseCase } from './use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import { InactivateOrganizationMemberController } from './use-cases/inactivate-organization-member/inactivate-organization-member.controller';
import { InactivateOrganizationMemberUseCase } from './use-cases/inactivate-organization-member/inactivate-organization-member.use-case';
import { ListOrganizationMembersController } from './use-cases/list-organization-members/list-organization-members.controller';
import { ListOrganizationMembersUseCase } from './use-cases/list-organization-members/list-organization-members.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([OrganizationMember])],
	controllers: [
		CreateOrganizationMemberController,
		ActivateOrganizationMemberController,
		InactivateOrganizationMemberController,
		ListOrganizationMembersController,
	],
	providers: [
		{
			provide: ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new OrganizationMembersRepository(dataSource);
			},
			inject: [DataSource],
		},
		GetExistingOrganizationMemberUseCase,
		CreateOrganizationMemberUseCase,
		ActivateOrganizationMemberUseCase,
		InactivateOrganizationMemberUseCase,
		ListOrganizationMembersUseCase,
	],
	exports: [ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY],
})
export class OrganizationMembersModule {}
