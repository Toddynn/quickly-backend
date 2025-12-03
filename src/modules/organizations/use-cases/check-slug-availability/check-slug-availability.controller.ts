import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { CheckSlugAvailabilityResponseDto } from '../../models/dto/output/check-slug-availability-response.dto';
import { CheckSlugAvailabilityUseCase } from './check-slug-availability.use-case';
import { CheckSlugAvailabilityDocs } from './docs';

@ApiTags('Organizations')
@Controller('organizations')
export class CheckSlugAvailabilityController {
	constructor(
		@Inject(CheckSlugAvailabilityUseCase)
		private readonly checkSlugAvailabilityUseCase: CheckSlugAvailabilityUseCase,
	) {}

	@Get('check-slug-availability/:slug')
	@CheckSlugAvailabilityDocs()
	async execute(@Param('slug') slug: string): Promise<CheckSlugAvailabilityResponseDto> {
		return await this.checkSlugAvailabilityUseCase.execute(slug);
	}
}

