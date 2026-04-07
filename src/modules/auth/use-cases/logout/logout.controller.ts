import { Controller, HttpCode, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LogoutDocs } from './docs';
import { LogoutUseCase } from './logout.use-case';

@ApiTags('Auth')
@Controller('auth')
export class LogoutController {
	constructor(
		@Inject(LogoutUseCase)
		private readonly logoutUseCase: LogoutUseCase,
	) {}

	@Post('logout')
	@HttpCode(HttpStatus.NO_CONTENT)
	@LogoutDocs()
	async execute(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
		return await this.logoutUseCase.execute(request, response);
	}
}
