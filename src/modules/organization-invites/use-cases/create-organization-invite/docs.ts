import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationInviteDto } from '../../models/dto/create-organization-invite.dto';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';

export function CreateOrganizationInviteDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cria um novo convite para organização',
			description: 'Cria um convite único com prazo de validade de 7 dias. O ID do convite (UUID) será usado como identificador único.',
		}),
		ApiBody({
			type: CreateOrganizationInviteDto,
			description: 'Dados para criação de convite',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Convite criado com sucesso.',
			type: OrganizationInvite,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para criação de convite.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao criar convite.',
		}),
	);
}
