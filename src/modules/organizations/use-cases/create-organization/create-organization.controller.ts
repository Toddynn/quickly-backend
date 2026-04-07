import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import type { JwtPayload } from '@/modules/auth/strategies/jwt.strategy';
import { CreateOrganizationDto } from '../../models/dto/input/create-organization.dto';
import { Organization } from '../../models/entities/organization.entity';
import { CreateOrganizationUseCase } from './create-organization.use-case';
import { CreateOrganizationDocs } from './docs';

@ApiTags('Organizations')
@ApiBearerAuth()
@Controller('organizations')
export class CreateOrganizationController {
	constructor(
		@Inject(CreateOrganizationUseCase)
		private readonly createOrganizationUseCase: CreateOrganizationUseCase,
	) {}

	@Post()
	@CreateOrganizationDocs()
	async execute(@CurrentUser() currentUser: JwtPayload, @Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
		return await this.createOrganizationUseCase.execute({
			...createOrganizationDto,
			owner_id: currentUser.sub,
		});
	}
}
