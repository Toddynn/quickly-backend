import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ValidatePasswordResetOtpDto } from '../../models/dto/validate-password-reset-otp.dto';
import { ValidatePasswordResetOtpDocs } from './docs';
import { ValidatePasswordResetOtpUseCase } from './validate-password-reset-otp.use-case';

@ApiTags('Users')
@Controller('users')
export class ValidatePasswordResetOtpController {
	constructor(
		@Inject(ValidatePasswordResetOtpUseCase)
		private readonly validatePasswordResetOtpUseCase: ValidatePasswordResetOtpUseCase,
	) {}

	@Post('password-reset/validate-otp')
	@ValidatePasswordResetOtpDocs()
	async execute(@Body() validatePasswordResetOtpDto: ValidatePasswordResetOtpDto): Promise<{ valid: boolean }> {
		return await this.validatePasswordResetOtpUseCase.execute(validatePasswordResetOtpDto);
	}
}
