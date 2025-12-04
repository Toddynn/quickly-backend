import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidateEmailConfirmationOtpDto } from '../../models/dto/input/validate-email-confirmation-otp.dto';

export function ValidateEmailConfirmationOtpDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Validate OTP code for email confirmation',
			description:
				'Validates the OTP code sent by email. The code must be pending and not expired. After successful validation, the OTP is marked as validated and can be used to confirm the email.',
		}),
		ApiBody({
			type: ValidateEmailConfirmationOtpDto,
			description: 'OTP code for validation. The email will be obtained from the authenticated user.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Valid OTP code.',
			schema: {
				example: {
					valid: true,
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid or expired OTP code.',
			schema: {
				examples: {
					otp_invalido: {
						summary: 'Invalid OTP',
						value: {
							message: 'Email ou código OTP inválido.',
						},
					},
					otp_expirado: {
						summary: 'Expired OTP',
						value: {
							message: 'Código OTP expirado.',
						},
					},
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while validating OTP code.',
		}),
	);
}
