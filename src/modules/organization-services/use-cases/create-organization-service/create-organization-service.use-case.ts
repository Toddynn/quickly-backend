import { Inject, Injectable } from '@nestjs/common';
import { GetExistingOrganizationUseCase } from '@/modules/organizations/use-cases/get-existing-organization/get-existing-organization.use-case';
import { GetExistingServiceCategoryUseCase } from '@/modules/service-categories/use-cases/get-existing-service-category/get-existing-service-category.use-case';
import { EnforcePlanLimitUseCase } from '@/modules/subscriptions/use-cases/enforce-plan-limit/enforce-plan-limit.use-case';
import type { CreateOrganizationServiceDto } from '../../models/dto/input/create-organization-service.dto';
import type { OrganizationService } from '../../models/entities/organization-service.entity';
import type { OrganizationServicesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { ValidateDurationUseCase } from '../validate-duration/validate-duration.use-case';

@Injectable()
export class CreateOrganizationServiceUseCase {
	constructor(
		@Inject(ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationServicesRepository: OrganizationServicesRepositoryInterface,
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
		@Inject(GetExistingServiceCategoryUseCase)
		private readonly getExistingServiceCategoryUseCase: GetExistingServiceCategoryUseCase,
		@Inject(ValidateDurationUseCase)
		private readonly validateDurationUseCase: ValidateDurationUseCase,
		@Inject(EnforcePlanLimitUseCase)
		private readonly enforcePlanLimitUseCase: EnforcePlanLimitUseCase,
	) {}

	async execute(organizationId: string, createOrganizationServiceDto: CreateOrganizationServiceDto): Promise<OrganizationService> {
		await this.getExistingOrganizationUseCase.execute({
			where: { id: organizationId },
		});

		if (createOrganizationServiceDto.service_category_id) {
			await this.getExistingServiceCategoryUseCase.execute({
				where: { id: createOrganizationServiceDto.service_category_id, organization_id: organizationId },
			});
		}

		this.validateDurationUseCase.execute(createOrganizationServiceDto.duration_minutes);

		const currentServicesCount = await this.organizationServicesRepository.count({ where: { organization_id: organizationId, active: true } });
		await this.enforcePlanLimitUseCase.execute(organizationId, 'services', currentServicesCount);

		const organizationService = this.organizationServicesRepository.create({
			...createOrganizationServiceDto,
			organization_id: organizationId,
			active: createOrganizationServiceDto.active ?? true,
		});

		await this.organizationServicesRepository.save(organizationService);

		return organizationService;
	}
}
