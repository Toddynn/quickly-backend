import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwitchOrganizationDto } from '../../models/dto/input/switch-organization.dto';
import type { AuthTokensDto } from '../../models/dto/output/auth-tokens.dto';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { JwtPayload } from '../../strategies/jwt.strategy';
import { SwitchOrganizationDocs } from './docs';
import { SwitchOrganizationUseCase } from './switch-organization.use-case';

@ApiTags('Auth')
@Controller('auth')
export class SwitchOrganizationController {
	constructor(
		@Inject(SwitchOrganizationUseCase)
		private readonly switchOrganizationUseCase: SwitchOrganizationUseCase,
	) {}

	@Post('switch-organization')
	@HttpCode(HttpStatus.OK)
	@SwitchOrganizationDocs()
	async execute(@CurrentUser() currentUser: JwtPayload, @Body() switchDto: SwitchOrganizationDto): Promise<AuthTokensDto> {
		return await this.switchOrganizationUseCase.execute(currentUser, switchDto);
	}
}
