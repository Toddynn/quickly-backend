import { Inject, Injectable } from '@nestjs/common';
import type { OrganizationService } from '../../models/entities/organization-service.entity';
import { GetExistingOrganizationServiceUseCase } from '../get-existing-organization-service/get-existing-organization-service.use-case';

@Injectable()
export class GetOrganizationServiceUseCase {
	constructor(
		@Inject(GetExistingOrganizationServiceUseCase)
		private readonly getExistingOrganizationServiceUseCase: GetExistingOrganizationServiceUseCase,
	) {}

	async execute(id: string): Promise<OrganizationService> {
		return await this.getExistingOrganizationServiceUseCase.execute({
			where: { id },
			relations: ['organization', 'serviceCategory'],
		});
	}
}
