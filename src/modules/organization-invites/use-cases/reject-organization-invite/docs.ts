import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function RejectOrganizationInviteDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Recusa um convite para organização',
			description: 'Recusa um convite pendente, atualizando o status para RECUSADO.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID único do convite (UUID)',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Convite recusado com sucesso.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Convite não está mais pendente.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Convite não encontrado.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao recusar convite.',
		}),
	);
}
