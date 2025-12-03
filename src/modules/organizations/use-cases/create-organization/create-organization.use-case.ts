import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganizationMemberUseCase } from '../../../organization-members/use-cases/create-organization-member/create-organization-member.use-case';
import type { CreateOrganizationDto } from '../../models/dto/input/create-organization.dto';
import type { Organization } from '../../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { OrganizationSlug } from '../../shared/value-objects/organization-slug';
import { GetExistingOrganizationUseCase } from '../get-existing-organization/get-existing-organization.use-case';

@Injectable()
export class CreateOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
		@Inject(CreateOrganizationMemberUseCase)
		private readonly createOrganizationMemberUseCase: CreateOrganizationMemberUseCase,
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
	) {}

	async execute(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
		// Validar e normalizar o slug usando a classe de valor
		const organizationSlug = new OrganizationSlug(createOrganizationDto.slug);
		const normalizedSlug = organizationSlug.getValue();

		// Verificar se já existe uma organização com este slug
		await this.getExistingOrganizationUseCase.execute(
			{
				where: { slug: normalizedSlug },
			},
			{ throwIfFound: true },
		);

		const organization = this.organizationsRepository.create({
			...createOrganizationDto,
			slug: normalizedSlug,
		});
		await this.organizationsRepository.save(organization);

		await this.createOrganizationMemberUseCase.execute({
			organization_id: organization.id,
			user_id: createOrganizationDto.owner_id,
		});

		return organization;
	}
}
