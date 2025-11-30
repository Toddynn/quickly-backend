import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function CancelOrganizationInviteDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cancela um convite para organização',
			description: 'Cancela um convite pendente, tornando o link inválido.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID do convite',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Convite cancelado com sucesso.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Apenas convites pendentes podem ser cancelados.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Convite não encontrado.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao cancelar convite.',
		}),
	);
}
