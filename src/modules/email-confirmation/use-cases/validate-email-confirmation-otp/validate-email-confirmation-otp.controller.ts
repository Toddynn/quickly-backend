import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidateEmailConfirmationOtpDto } from '../../models/dto/input/validate-email-confirmation-otp.dto';
import { ValidateEmailConfirmationOtpDocs } from './docs';
import { ValidateEmailConfirmationOtpUseCase } from './validate-email-confirmation-otp.use-case';

@ApiTags('Email Confirmation')
@Controller('email-confirmation')
export class ValidateEmailConfirmationOtpController {
	constructor(
		@Inject(ValidateEmailConfirmationOtpUseCase)
		private readonly validateEmailConfirmationOtpUseCase: ValidateEmailConfirmationOtpUseCase,
	) {}

	@Post('validate-otp')
	@ValidateEmailConfirmationOtpDocs()
	async execute(@Body() validateEmailConfirmationOtpDto: ValidateEmailConfirmationOtpDto): Promise<{ valid: boolean }> {
		return await this.validateEmailConfirmationOtpUseCase.execute(validateEmailConfirmationOtpDto);
	}
}

