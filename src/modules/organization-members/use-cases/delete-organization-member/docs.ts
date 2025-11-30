import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Remove um membro da organização',
			description: 'Remove o vínculo de um usuário com uma organização.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID do membro da organização',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.NO_CONTENT,
			description: 'Membro da organização removido com sucesso.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Membro da organização não encontrado.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao remover membro da organização.',
		}),
	);
}
