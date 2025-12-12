import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationInvite } from '../../models/entities/organization-invite.entity';
import { GetExistingOrganizationInviteUseCase } from '../get-existing-organization-invite/get-existing-organization-invite.use-case';

@Injectable()
export class GetOrganizationInviteByIdUseCase {
	constructor(
		@Inject(GetExistingOrganizationInviteUseCase)
		private readonly getExistingOrganizationInviteUseCase: GetExistingOrganizationInviteUseCase,
	) {}

	async execute(id: string): Promise<OrganizationInvite> {
		return await this.getExistingOrganizationInviteUseCase.execute(
			{
				where: { id },
				relations: ['organization', 'inviter'],
			},
			{ throwIfNotFound: true },
		);
	}
}



