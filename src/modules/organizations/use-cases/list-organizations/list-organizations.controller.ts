import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import { ListOrganizationResponseDto } from '../../models/dto/output/list-organization-response.dto';
import { ListOrganizationsDocs } from './docs';
import { ListOrganizationsUseCase } from './list-organizations.use-case';

@ApiTags('Organizations')
@ApiCookieAuth()
@Controller('organizations')
export class ListOrganizationsController {
	constructor(
		@Inject(ListOrganizationsUseCase)
		private readonly listOrganizationsUseCase: ListOrganizationsUseCase,
	) {}

	@Get()
	@ListOrganizationsDocs()
	async execute(@CurrentUser() currentUser: SessionUser, @Query() paginationDto: PaginationDto): Promise<PaginatedResponseDto<ListOrganizationResponseDto>> {
		return await this.listOrganizationsUseCase.execute(currentUser.userId, paginationDto);
	}
}
