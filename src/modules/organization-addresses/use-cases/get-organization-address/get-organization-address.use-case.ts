import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationAddress } from '../../models/entities/organization-address.entity';
import { GetExistingOrganizationAddressUseCase } from '../get-existing-organization-address/get-existing-organization-address.use-case';

@Injectable()
export class GetOrganizationAddressUseCase {
	constructor(
		@Inject(GetExistingOrganizationAddressUseCase)
		private readonly getExistingOrganizationAddressUseCase: GetExistingOrganizationAddressUseCase,
	) {}

	async execute(id: string): Promise<OrganizationAddress> {
		return await this.getExistingOrganizationAddressUseCase.execute({
			where: { id },
			relations: ['organization'],
		});
	}
}
