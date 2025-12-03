import { Inject, Injectable } from '@nestjs/common';
import type { CheckSlugAvailabilityResponseDto } from '../../models/dto/output/check-slug-availability-response.dto';
import { OrganizationSlug } from '../../shared/value-objects/organization-slug';
import { GetExistingOrganizationUseCase } from '../get-existing-organization/get-existing-organization.use-case';

@Injectable()
export class CheckSlugAvailabilityUseCase {
	constructor(
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
	) {}

	async execute(slug: string): Promise<CheckSlugAvailabilityResponseDto> {
		const organizationSlug = new OrganizationSlug(slug);
		const normalizedSlug = organizationSlug.getValue();

		// Verificar se já existe uma organização com este slug
		const existingOrganization = await this.getExistingOrganizationUseCase.execute(
			{
				where: { slug: normalizedSlug },
			},
			{ throwIfNotFound: false },
		);

		return {
			slug: normalizedSlug,
			available: !existingOrganization,
		};
	}
}

