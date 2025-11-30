import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordDto } from '../../models/dto/reset-password.dto';

export function ResetPasswordDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Redefine a senha após validação do OTP',
			description:
				'Redefine a senha do usuário. Requer que o código OTP tenha sido validado anteriormente através do endpoint de validação. A senha deve atender aos critérios de segurança: pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.',
		}),
		ApiBody({
			type: ResetPasswordDto,
			description: 'Email e nova senha para redefinição',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Senha redefinida com sucesso.',
			schema: {
				example: {
					message: 'Senha redefinida com sucesso.',
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos ou OTP não validado.',
			schema: {
				examples: {
					otp_nao_validado: {
						summary: 'OTP não validado',
						value: {
							message: 'Nenhum código OTP validado encontrado. Por favor, valide o código OTP primeiro.',
						},
					},
					otp_expirado: {
						summary: 'OTP expirado',
						value: {
							message: 'Código OTP expirado.',
						},
					},
					senha_invalida: {
						summary: 'Senha não atende aos critérios',
						value: {
							message: 'A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um símbolo.',
						},
					},
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao redefinir senha.',
		}),
	);
}
