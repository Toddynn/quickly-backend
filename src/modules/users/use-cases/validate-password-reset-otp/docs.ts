import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ValidatePasswordResetOtpDto } from '../../models/dto/validate-password-reset-otp.dto';

export function ValidatePasswordResetOtpDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Valida código OTP para recuperação de senha',
			description:
				'Valida o código OTP enviado por email. O código deve estar pendente e não expirado. Após a validação bem-sucedida, o OTP é marcado como validado e pode ser usado para redefinir a senha.',
		}),
		ApiBody({
			type: ValidatePasswordResetOtpDto,
			description: 'Email e código OTP para validação',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Código OTP válido.',
			schema: {
				example: {
					valid: true,
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Código OTP inválido ou expirado.',
			schema: {
				examples: {
					otp_invalido: {
						summary: 'OTP inválido',
						value: {
							message: 'Email ou código OTP inválido.',
						},
					},
					otp_expirado: {
						summary: 'OTP expirado',
						value: {
							message: 'Código OTP expirado.',
						},
					},
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao validar código OTP.',
		}),
	);
}

