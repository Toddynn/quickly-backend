import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { GetExistingUserUseCase } from '@/modules/users/use-cases/get-existing-user/get-existing-user.use-case';
import { CreateOrganizationDto } from '../../models/dto/input/create-organization.dto';
import { Organization } from '../../models/entities/organization.entity';
import { CreateOrganizationUseCase } from './create-organization.use-case';
import { CreateOrganizationDocs } from './docs';

@ApiTags('Organizations')
@ApiCookieAuth()
@Controller('organizations')
export class CreateOrganizationController {
	constructor(
		@Inject(CreateOrganizationUseCase)
		private readonly createOrganizationUseCase: CreateOrganizationUseCase,
		@Inject(GetExistingUserUseCase)
		private readonly getExistingUserUseCase: GetExistingUserUseCase,
	) {}

	@Post()
	@CreateOrganizationDocs()
	async execute(
		@CurrentUser() currentUser: SessionUser,
		@Body() createOrganizationDto: CreateOrganizationDto,
	): Promise<{ organization: Organization; checkoutUrl: string }> {
		const user = await this.getExistingUserUseCase.execute({ where: { id: currentUser.userId } });

		return await this.createOrganizationUseCase.execute(createOrganizationDto, currentUser.userId, {
			name: user.name,
			email: user.email,
		});
	}
}
