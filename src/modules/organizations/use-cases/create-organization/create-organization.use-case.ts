import { Inject, Injectable } from '@nestjs/common';
import type { CreateOrganizationDto } from '../../models/dto/create-organization.dto';
import type { Organization } from '../../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class CreateOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
	) {}

	async execute(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
		const organization = this.organizationsRepository.create(createOrganizationDto);
		return await this.organizationsRepository.save(organization);
	}
}
