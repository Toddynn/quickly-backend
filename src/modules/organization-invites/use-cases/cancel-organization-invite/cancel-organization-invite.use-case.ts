import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { INVITE_STATUS } from '../../shared/interfaces/invite-status';
import { GetExistingOrganizationInviteUseCase } from '../get-existing-organization-invite/get-existing-organization-invite.use-case';

@Injectable()
export class CancelOrganizationInviteUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
		@Inject(GetExistingOrganizationInviteUseCase)
		private readonly getExistingOrganizationInviteUseCase: GetExistingOrganizationInviteUseCase,
	) {}

	async execute(id: string): Promise<void> {
		const invite = await this.getExistingOrganizationInviteUseCase.execute({
			where: { id },
		});

		if (invite.status !== INVITE_STATUS.PENDING) {
			throw new BadRequestException('Apenas convites pendentes podem ser cancelados.');
		}

		await this.organizationInvitesRepository.update(invite.id, { status: INVITE_STATUS.CANCELED });
	}
}
