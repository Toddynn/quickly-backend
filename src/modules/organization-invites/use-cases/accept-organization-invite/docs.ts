import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function AcceptOrganizationInviteDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Aceita um convite para organização',
			description: 'Aceita um convite pendente e vincula o usuário à organização como membro.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID único do convite (UUID)',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Convite aceito com sucesso. Usuário vinculado à organização.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Convite não está mais pendente ou está expirado.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Convite não encontrado.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao aceitar convite.',
		}),
	);
}
