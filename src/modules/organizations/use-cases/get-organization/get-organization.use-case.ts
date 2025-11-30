import { Inject, Injectable } from '@nestjs/common';
import type { Organization } from '../../models/entities/organization.entity';
import { GetExistingOrganizationUseCase } from '../get-existing-organization/get-existing-organization.use-case';

@Injectable()
export class GetOrganizationUseCase {
	constructor(
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
	) {}

	async execute(id: string): Promise<Organization> {
		return await this.getExistingOrganizationUseCase.execute({
			where: { id },
			relations: ['owner', 'organizationMembers', 'organizationMembers.user'],
		});
	}
}
