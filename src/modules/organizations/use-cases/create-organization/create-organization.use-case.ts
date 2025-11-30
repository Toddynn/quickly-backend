import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganizationMemberUseCase } from '../../../organization-members/use-cases/create-organization-member/create-organization-member.use-case';
import type { CreateOrganizationDto } from '../../models/dto/create-organization.dto';
import type { Organization } from '../../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class CreateOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
		@Inject(CreateOrganizationMemberUseCase)
		private readonly createOrganizationMemberUseCase: CreateOrganizationMemberUseCase,
	) {}

	async execute(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
		const organization = this.organizationsRepository.create(createOrganizationDto);
		await this.organizationsRepository.save(organization);

		await this.createOrganizationMemberUseCase.execute({
			organization_id: organization.id,
			user_id: createOrganizationDto.owner_id,
		});

		return organization;
	}
}
