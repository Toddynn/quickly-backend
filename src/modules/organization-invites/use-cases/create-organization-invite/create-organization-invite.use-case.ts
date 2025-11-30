import { Inject, Injectable } from '@nestjs/common';
import type { CreateOrganizationInviteDto } from '../../models/dto/create-organization-invite.dto';
import type { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { INVITE_STATUS } from '../../shared/constants/invite-status';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class CreateOrganizationInviteUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
	) {}

	async execute(createOrganizationInviteDto: CreateOrganizationInviteDto): Promise<OrganizationInvite> {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 7);

		const organizationInvite = this.organizationInvitesRepository.create({
			...createOrganizationInviteDto,
			expiration_date: expirationDate,
			status: INVITE_STATUS.PENDING,
		});

		return await this.organizationInvitesRepository.save(organizationInvite);
	}
}
