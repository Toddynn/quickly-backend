import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../../models/dto/input/login.dto';
import type { AuthTokensDto } from '../../models/dto/output/auth-tokens.dto';
import { Public } from '../../shared/decorators/public.decorator';
import { CreateAccessTokenUseCase } from './create-access-token.use-case';
import { CreateAccessTokenDocs } from './docs';

@ApiTags('Auth')
@Controller('auth')
export class CreateAccessTokenController {
	constructor(
		@Inject(CreateAccessTokenUseCase)
		private readonly createAccessTokenUseCase: CreateAccessTokenUseCase,
	) {}

	@Post('login')
	@Public()
	@HttpCode(HttpStatus.OK)
	@CreateAccessTokenDocs()
	async execute(@Body() loginDto: LoginDto): Promise<AuthTokensDto> {
		return await this.createAccessTokenUseCase.execute(loginDto);
	}
}
