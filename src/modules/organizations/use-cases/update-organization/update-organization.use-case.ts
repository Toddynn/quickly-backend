import { Inject, Injectable } from '@nestjs/common';
import type { UpdateResult } from 'typeorm';
import type { UpdateOrganizationDto } from '../../models/dto/input/update-organization.dto';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationUseCase } from '../get-existing-organization/get-existing-organization.use-case';

@Injectable()
export class UpdateOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
	) {}

	async execute(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<UpdateResult> {
		const organization = await this.getExistingOrganizationUseCase.execute({ where: { id } });

		return await this.organizationsRepository.update(organization.id, updateOrganizationDto);
	}
}
