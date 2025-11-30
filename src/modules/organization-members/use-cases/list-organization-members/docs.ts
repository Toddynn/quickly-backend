import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { OrganizationMember } from '../../models/entities/organization-member.entity';

export function ListOrganizationMembersDocs() {
	return applyDecorators(
		ApiExtraModels(OrganizationMember),
		ApiOperation({
			summary: 'Lista todos os membros das organizações',
			description: 'Retorna uma lista paginada com todos os membros das organizações. Pode ser filtrado por status ativo/inativo.',
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
		ApiQuery({
			name: 'is_active',
			required: false,
			type: Boolean,
			description: 'Filtrar por membros ativos (true) ou inativos (false). Se não informado, retorna todos.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Lista de membros retornada com sucesso.',
			schema: getPaginatedResponseSchema(OrganizationMember),
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao listar membros.',
		}),
	);
}
