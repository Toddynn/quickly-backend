import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function InactivateOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Desativa um membro da organização',
			description: 'Desativa um membro da organização, mantendo o histórico de agendamentos intacto.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID do membro da organização',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Membro da organização desativado com sucesso.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Membro da organização não encontrado.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao desativar membro da organização.',
		}),
	);
}
