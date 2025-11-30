import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { getPaginatedResponseSchema } from '@/shared/helpers/paginated-response-schema.helper';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';

export function ListOrganizationInvitesDocs() {
	return applyDecorators(
		ApiExtraModels(OrganizationInvite),
		ApiOperation({
			summary: 'Lista todos os convites de organizações',
			description: 'Retorna uma lista paginada com todos os convites enviados.',
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
			description: 'Lista de convites retornada com sucesso.',
			schema: getPaginatedResponseSchema(OrganizationInvite),
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao listar convites.',
		}),
	);
}
