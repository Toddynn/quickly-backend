import { Inject, Injectable } from '@nestjs/common';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import { GetExistingOrganizationUseCase } from '@/modules/organizations/use-cases/get-existing-organization/get-existing-organization.use-case';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import type { CreateOrganizationInviteDto } from '../../models/dto/create-organization-invite.dto';
import type { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { INVITE_STATUS } from '../../shared/constants/invite-status';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationInviteUseCase } from '../get-existing-organization-invite/get-existing-organization-invite.use-case';
import { SendOrganizationInviteEmailUseCase } from '../send-organization-invite-email/send-organization-invite-email.use-case';

@Injectable()
export class CreateOrganizationInviteUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
		@Inject(GetExistingOrganizationInviteUseCase)
		private readonly getExistingOrganizationInviteUseCase: GetExistingOrganizationInviteUseCase,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
		@Inject(SendOrganizationInviteEmailUseCase)
		private readonly sendOrganizationInviteEmailUseCase: SendOrganizationInviteEmailUseCase,
	) {}

	async execute(createOrganizationInviteDto: CreateOrganizationInviteDto): Promise<OrganizationInvite> {
		
          await this.getExistingOrganizationInviteUseCase.execute({
               where: {
                    email: createOrganizationInviteDto.email,
                    organization_id: createOrganizationInviteDto.organization_id,
                    status: INVITE_STATUS.PENDING,
               },
          }, { throwIfFound: true });

          const user = await this.getExistingUserUseCase.execute({
               where: { email: createOrganizationInviteDto.email },
          });

          await this.getExistingOrganizationMemberUseCase.execute({
               where: {
                    user_id: user.id,
                    organization_id: createOrganizationInviteDto.organization_id,
                    active: true,
               },
          }, { throwIfFound: true});


		const organization = await this.getExistingOrganizationUseCase.execute({
			where: { id: createOrganizationInviteDto.organization_id },
		});

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7);

		const organizationInvite = this.organizationInvitesRepository.create({
			...createOrganizationInviteDto,
			expiration_date: expirationDate,
			status: INVITE_STATUS.PENDING,
		});

          await this.organizationInvitesRepository.save(organizationInvite);

		await this.sendOrganizationInviteEmailUseCase.execute({
			email: createOrganizationInviteDto.email,
			inviteId: organizationInvite.id,
			organizationName: organization.name,
		});

		return organizationInvite;
	}
}
