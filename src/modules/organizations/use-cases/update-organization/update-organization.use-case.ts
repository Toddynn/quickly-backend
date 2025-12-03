import { Inject, Injectable } from '@nestjs/common';
import type { UpdateResult } from 'typeorm';
import type { UpdateOrganizationDto } from '../../models/dto/input/update-organization.dto';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { OrganizationSlug } from '../../shared/value-objects/organization-slug';
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

		// Se o slug estiver sendo atualizado, validar e normalizar
		if (updateOrganizationDto.slug) {
			const organizationSlug = new OrganizationSlug(updateOrganizationDto.slug);
			const normalizedSlug = organizationSlug.getValue();

			// Verificar se já existe outra organização com este slug (exceto a atual)
			if (normalizedSlug !== organization.slug) {
				await this.getExistingOrganizationUseCase.execute(
					{
						where: { slug: normalizedSlug },
					},
					{ throwIfFound: true },
				);
			}

			updateOrganizationDto.slug = normalizedSlug;
		}

		return await this.organizationsRepository.update(organization.id, updateOrganizationDto);
	}
}
