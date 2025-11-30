import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidatePasswordResetOtpDto } from '../../models/dto/validate-password-reset-otp.dto';

export function ValidatePasswordResetOtpDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Validate OTP code for password recovery',
			description:
				'Validates the OTP code sent by email. The code must be pending and not expired. After successful validation, the OTP is marked as validated and can be used to reset the password.',
		}),
		ApiBody({
			type: ValidatePasswordResetOtpDto,
			description: 'Email and OTP code for validation',
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
