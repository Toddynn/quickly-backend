import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordDto } from '../../models/dto/input/reset-password.dto';

export function ResetPasswordDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Reset password after OTP validation',
			description:
				'Resets the user password using the temporary token received after OTP validation. The token expires in 2 minutes. The password must meet security criteria: at least 8 characters, one uppercase letter, one lowercase letter, one number and one symbol.',
		}),
		ApiBody({
			type: ResetPasswordDto,
			description: 'Temporary token and new password for reset',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Password reset successfully.',
			schema: {
				example: {
					message: 'Senha redefinida com sucesso.',
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data or OTP not validated.',
			schema: {
				examples: {
					token_invalido: {
						summary: 'Invalid or expired token',
						value: {
							message: 'Token inválido ou expirado. Por favor, valide o código OTP novamente.',
						},
					},
					token_nao_encontrado: {
						summary: 'Token not found',
						value: {
							message: 'Token inválido. O código OTP já foi utilizado ou não existe.',
						},
					},
					senha_invalida: {
						summary: 'Password does not meet criteria',
						value: {
							message: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.',
						},
					},
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while resetting password.',
		}),
	);
}

