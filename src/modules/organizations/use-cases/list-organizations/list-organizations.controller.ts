import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import type { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';
import { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationResponseDto } from '../../models/dto/output/list-organization-response.dto';
import { ListOrganizationsDocs } from './docs';
import { ListOrganizationsUseCase } from './list-organizations.use-case';

@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
export class ListOrganizationsController {
	constructor(
		@Inject(ListOrganizationsUseCase)
		private readonly listOrganizationsUseCase: ListOrganizationsUseCase,
	) {}

	@Get()
	@ListOrganizationsDocs()
	async execute(@CurrentUser() currentUser: JwtPayload, @Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationResponseDto>> {
		return await this.listOrganizationsUseCase.execute(currentUser.sub, paginationDto);
	}
}
