import { Controller, HttpCode, HttpStatus, Inject, Post, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SessionUserDto } from '../../models/dto/output/session-user.dto';
import { RefreshSessionDocs } from './docs';
import { RefreshSessionUseCase } from './refresh-session.use-case';

@ApiTags('Auth')
@ApiCookieAuth()
@Controller('auth')
export class RefreshSessionController {
	constructor(
		@Inject(RefreshSessionUseCase)
		private readonly refreshSessionUseCase: RefreshSessionUseCase,
	) {}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@RefreshSessionDocs()
	async execute(@Req() request: Request): Promise<SessionUserDto> {
		return await this.refreshSessionUseCase.execute(request);
	}
}
