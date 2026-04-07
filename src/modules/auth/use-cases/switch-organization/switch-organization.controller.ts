import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SwitchOrganizationDto } from '../../models/dto/input/switch-organization.dto';
import { SessionUserDto } from '../../models/dto/output/session-user.dto';
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
	async execute(@Req() request: Request, @Body() switchDto: SwitchOrganizationDto): Promise<SessionUserDto> {
		return await this.switchOrganizationUseCase.execute(request, switchDto);
	}
}
