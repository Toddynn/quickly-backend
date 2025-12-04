import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyEmailDto } from '../../models/dto/input/verify-email.dto';
import { VerifyEmailDocs } from './docs';
import { VerifyEmailUseCase } from './verify-email.use-case';

@ApiTags('Email Confirmation')
@Controller('email-confirmation')
export class VerifyEmailController {
	constructor(
		@Inject(VerifyEmailUseCase)
		private readonly verifyEmailUseCase: VerifyEmailUseCase,
	) {}

	@Post('verify-email')
	@VerifyEmailDocs()
	async execute(@Body() verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
		await this.verifyEmailUseCase.execute(verifyEmailDto);
		return { message: 'Código OTP enviado para o email.' };
	}
}

