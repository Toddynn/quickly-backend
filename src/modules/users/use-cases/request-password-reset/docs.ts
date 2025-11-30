import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestPasswordResetDto } from '../../models/dto/request-password-reset.dto';

export function RequestPasswordResetDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Solicita recuperação de senha',
			description:
				'Envia um código OTP de 6 dígitos para o email informado. O código expira em 15 minutos. Por questões de segurança, a resposta é sempre a mesma, independente do email existir ou não no sistema.',
		}),
		ApiBody({
			type: RequestPasswordResetDto,
			description: 'Email do usuário para recuperação de senha',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Se o email existir, um código OTP foi enviado.',
			schema: {
				example: {
					message: 'Se o email existir, um código OTP foi enviado.',
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para solicitação de recuperação de senha.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao solicitar recuperação de senha.',
		}),
	);
}
