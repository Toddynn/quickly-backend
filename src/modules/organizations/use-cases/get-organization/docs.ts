import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Organization } from '../../models/entities/organization.entity';

export function GetOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Busca uma organização por ID',
			description: 'Retorna os dados de uma organização específica pelo seu ID.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID da organização',
			type: String,
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organização encontrada com sucesso.',
			type: Organization,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organização não encontrada.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao buscar organização.',
		}),
	);
}
