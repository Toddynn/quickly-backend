import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestPasswordResetDto } from '../../models/dto/request-password-reset.dto';
import { RequestPasswordResetDocs } from './docs';
import { RequestPasswordResetUseCase } from './request-password-reset.use-case';

@ApiTags('Users')
@Controller('users')
export class RequestPasswordResetController {
	constructor(
		@Inject(RequestPasswordResetUseCase)
		private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
	) {}

	@Post('password-reset/request')
	@RequestPasswordResetDocs()
	async execute(@Body() requestPasswordResetDto: RequestPasswordResetDto): Promise<{ message: string }> {
		await this.requestPasswordResetUseCase.execute(requestPasswordResetDto);
		return { message: 'Se o email existir, um código OTP foi enviado.' };
	}
}
