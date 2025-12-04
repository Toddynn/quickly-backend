import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidateEmailConfirmationOtpDto } from '../../models/dto/input/validate-email-confirmation-otp.dto';

export function ConfirmEmailDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Confirm email with OTP code',
			description:
				'Confirms the email by validating the OTP code. The OTP must be previously validated through the validate-otp endpoint. Supports two types: VERIFY_EMAIL (only marks email as verified) and CHANGE_EMAIL (changes email and marks as verified).',
		}),
		ApiBody({
			type: ValidateEmailConfirmationOtpDto,
			description: 'OTP code for confirmation. The email will be obtained from the authenticated user.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Email confirmed successfully.',
			schema: {
				example: {
					message: 'Email confirmado com sucesso.',
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
			status: HttpStatus.CONFLICT,
			description: 'Email already in use.',
			schema: {
				example: {
					message: 'O novo email já está em uso.',
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while confirming email.',
		}),
	);
}

