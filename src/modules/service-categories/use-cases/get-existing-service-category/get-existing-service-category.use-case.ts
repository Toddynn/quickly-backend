import { Inject, Injectable } from '@nestjs/common';
import type { FindOneOptions } from 'typeorm';
import { formatWhereClause } from '@/shared/helpers/format-where-clause.helper';
import { normalizeGetExistingOptions } from '@/shared/helpers/normalize-get-existing-options.helper';
import type { GetExistingOptions } from '@/shared/interfaces/get-existing-options';
import { NotFoundServiceCategoryException } from '../../errors/not-found-service-category.error';
import type { ServiceCategory } from '../../models/entities/service-category.entity';
import type { ServiceCategoriesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class GetExistingServiceCategoryUseCase {
	constructor(
		@Inject(SERVICE_CATEGORY_REPOSITORY_INTERFACE_KEY)
		private readonly serviceCategoriesRepository: ServiceCategoriesRepositoryInterface,
	) {}

	async execute(criteria: FindOneOptions<ServiceCategory>, options: GetExistingOptions = {}): Promise<ServiceCategory | null> {
		const { throwIfFound, throwIfNotFound } = normalizeGetExistingOptions(options);
		const fields = formatWhereClause(criteria.where || {});

		const serviceCategory = await this.serviceCategoriesRepository.findOne(criteria);

		if (!serviceCategory) {
			if (throwIfNotFound) {
				throw new NotFoundServiceCategoryException(fields);
			}
			return null;
		}

		if (throwIfFound) {
			throw new NotFoundServiceCategoryException(fields);
		}

		return serviceCategory;
	}
}
