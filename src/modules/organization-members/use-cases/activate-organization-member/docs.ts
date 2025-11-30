import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ActivateOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Ativa um membro da organização',
			description: 'Ativa um membro da organização, tornando-o novamente ativo.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID do membro da organização',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Membro da organização ativado com sucesso.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Membro da organização não encontrado.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao ativar membro da organização.',
		}),
	);
}
