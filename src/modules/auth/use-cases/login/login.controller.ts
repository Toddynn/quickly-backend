import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LoginDto } from '../../models/dto/input/login.dto';
import { SessionUserDto } from '../../models/dto/output/session-user.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { LoginDocs } from './docs';
import { LoginUseCase } from './login.use-case';

@ApiTags('Auth')
@Controller('auth')
export class LoginController {
	constructor(
		@Inject(LoginUseCase)
		private readonly loginUseCase: LoginUseCase,
	) {}

	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	@LoginDocs()
	async execute(@Req() request: Request, @Body() loginDto: LoginDto): Promise<SessionUserDto> {
		return await this.loginUseCase.execute(request, loginDto);
	}
}
