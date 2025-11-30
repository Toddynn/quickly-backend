import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { OrganizationMembersRepositoryInterface } from '../../../organization-members/models/interfaces/repository.interface';
import { ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY } from '../../../organization-members/shared/constants/repository-interface-key';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { INVITE_STATUS } from '../../shared/constants/invite-status';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationInviteUseCase } from '../get-existing-organization-invite/get-existing-organization-invite.use-case';

@Injectable()
export class AcceptOrganizationInviteUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
		@Inject(ORGANIZATION_MEMBER_REPOSITORY_INTERFACE_KEY)
		private readonly organizationMembersRepository: OrganizationMembersRepositoryInterface,
		@Inject(GetExistingOrganizationInviteUseCase)
		private readonly getExistingOrganizationInviteUseCase: GetExistingOrganizationInviteUseCase,
	) {}

	async execute(id: string, userId: string): Promise<void> {
		const invite = await this.getExistingOrganizationInviteUseCase.execute({
			where: { id },
			relations: ['organization'],
		});

		if (invite.status !== INVITE_STATUS.PENDING) {
			throw new BadRequestException('Convite não está mais pendente.');
		}

		const expirationDate = new Date(invite.expiration_date);
		if (expirationDate < new Date()) {
			await this.organizationInvitesRepository.update(invite.id, { status: INVITE_STATUS.EXPIRED });
			throw new BadRequestException('Convite expirado.');
		}

		await this.organizationMembersRepository.save({
			organization_id: invite.organization_id,
			user_id: userId,
		});

		await this.organizationInvitesRepository.update(invite.id, { status: INVITE_STATUS.ACCEPTED });
	}
}
