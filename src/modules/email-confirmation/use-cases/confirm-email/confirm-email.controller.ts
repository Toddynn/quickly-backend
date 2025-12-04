import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateEmailConfirmationOtpDto } from '../../models/dto/input/validate-email-confirmation-otp.dto';
import { ConfirmEmailDocs } from './docs';
import { ConfirmEmailUseCase } from './confirm-email.use-case';

@ApiTags('Email Confirmation')
@Controller('email-confirmation')
export class ConfirmEmailController {
	constructor(
		@Inject(ConfirmEmailUseCase)
		private readonly confirmEmailUseCase: ConfirmEmailUseCase,
	) {}

	@Post('confirm')
	@ConfirmEmailDocs()
	async execute(@Body() validateEmailConfirmationOtpDto: ValidateEmailConfirmationOtpDto): Promise<{ message: string }> {
		await this.confirmEmailUseCase.execute(validateEmailConfirmationOtpDto);
		return { message: 'Email confirmado com sucesso.' };
	}
}

