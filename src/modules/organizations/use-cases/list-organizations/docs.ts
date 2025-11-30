import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { Organization } from '../../models/entities/organization.entity';

export function ListOrganizationsDocs() {
	return applyDecorators(
		ApiExtraModels(Organization),
		ApiOperation({
			summary: 'Lista todas as organizações',
			description: 'Retorna uma lista paginada com todas as organizações cadastradas.',
		}),
		ApiQuery({
			name: 'page',
			required: false,
			type: Number,
			description: 'Número da página (padrão: 1)',
		}),
		ApiQuery({
			name: 'limit',
			required: false,
			type: Number,
			description: 'Quantidade de itens por página (padrão: 10)',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Lista de organizações retornada com sucesso.',
			schema: getPaginatedResponseSchema(Organization),
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao listar organizações.',
		}),
	);
}
