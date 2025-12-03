import { Inject, Injectable } from '@nestjs/common';
import type { UpdateResult } from 'typeorm';
import { GetExistingServiceCategoryUseCase } from '@/modules/service-categories/use-cases/get-existing-service-category/get-existing-service-category.use-case';
import type { UpdateOrganizationServiceDto } from '../../models/dto/input/update-organization-service.dto';
import type { OrganizationServicesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationServiceUseCase } from '../get-existing-organization-service/get-existing-organization-service.use-case';
import { ValidateDurationUseCase } from '../validate-duration/validate-duration.use-case';

@Injectable()
export class UpdateOrganizationServiceUseCase {
	constructor(
		@Inject(ORGANIZATION_SERVICE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationServicesRepository: OrganizationServicesRepositoryInterface,
		@Inject(GetExistingOrganizationServiceUseCase)
		private readonly getExistingOrganizationServiceUseCase: GetExistingOrganizationServiceUseCase,
		@Inject(GetExistingServiceCategoryUseCase)
		private readonly getExistingServiceCategoryUseCase: GetExistingServiceCategoryUseCase,
		@Inject(ValidateDurationUseCase)
		private readonly validateDurationUseCase: ValidateDurationUseCase,
	) {}

	async execute(id: string, updateOrganizationServiceDto: UpdateOrganizationServiceDto): Promise<UpdateResult> {
		const organizationService = await this.getExistingOrganizationServiceUseCase.execute({ where: { id } });

		if (updateOrganizationServiceDto.service_category_id) {
			await this.getExistingServiceCategoryUseCase.execute({
				where: { id: updateOrganizationServiceDto.service_category_id },
			});
		}

		if (updateOrganizationServiceDto.duration_minutes !== undefined) {
			this.validateDurationUseCase.execute(updateOrganizationServiceDto.duration_minutes);
		}

		return await this.organizationServicesRepository.update(organizationService.id, updateOrganizationServiceDto);
	}
}
