import { Inject, Injectable } from '@nestjs/common';
import { CreateSubscriptionUseCase } from '@/modules/subscriptions/use-cases/create-subscription/create-subscription.use-case';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { CreateOrganizationMemberUseCase } from '../../../organization-members/use-cases/create-organization-member/create-organization-member.use-case';
import type { CreateOrganizationDto } from '../../models/dto/input/create-organization.dto';
import type { Organization } from '../../models/entities/organization.entity';
import type { OrganizationsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { OrganizationSlug } from '../../shared/value-objects/organization-slug';
import { GetExistingOrganizationUseCase } from '../get-existing-organization/get-existing-organization.use-case';

interface OwnerContact {
	name: string;
	email: string;
}

@Injectable()
export class CreateOrganizationUseCase {
	constructor(
		@Inject(ORGANIZATION_REPOSITORY_INTERFACE_KEY)
		private readonly organizationsRepository: OrganizationsRepositoryInterface,
		@Inject(CreateOrganizationMemberUseCase)
		private readonly createOrganizationMemberUseCase: CreateOrganizationMemberUseCase,
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
		@Inject(CreateSubscriptionUseCase)
		private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
	) {}

	async execute(
		createOrganizationDto: CreateOrganizationDto,
		ownerId: string,
		ownerContact: OwnerContact,
	): Promise<{ organization: Organization; checkoutUrl: string }> {
		const organizationSlug = new OrganizationSlug(createOrganizationDto.slug);
		const normalizedSlug = organizationSlug.getValue();

		await this.getExistingOrganizationUseCase.execute(
			{
				where: { slug: normalizedSlug },
			},
			{ throwIfFound: true },
		);

		const organization = this.organizationsRepository.create({
			name: createOrganizationDto.name,
			description: createOrganizationDto.description,
			logo: createOrganizationDto.logo,
			owner_id: ownerId,
			slug: normalizedSlug,
		});
		await this.organizationsRepository.save(organization);

		await this.createOrganizationMemberUseCase.execute(organization.id, {
			user_id: ownerId,
			role: OrganizationRole.OWNER,
		});

		const { checkoutUrl } = await this.createSubscriptionUseCase.execute(organization.id, createOrganizationDto.plan_id, {
			name: ownerContact.name,
			email: ownerContact.email,
			taxId: createOrganizationDto.owner_tax_id,
		});

		return { organization, checkoutUrl };
	}
}
