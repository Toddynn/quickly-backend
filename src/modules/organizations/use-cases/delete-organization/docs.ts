import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function DeleteOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Deleta uma organização',
			description: 'Remove uma organização do sistema.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID da organização',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.NO_CONTENT,
			description: 'Organização deletada com sucesso.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organização não encontrada.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao deletar organização.',
		}),
	);
}
