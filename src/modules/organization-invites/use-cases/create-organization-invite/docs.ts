import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationInviteDto } from '../../models/dto/create-organization-invite.dto';
import { OrganizationInvite } from '../../models/entities/organization-invite.entity';

export function CreateOrganizationInviteDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cria um novo convite para organização',
			description:
				'Cria um convite único com prazo de validade de 7 dias. O ID do convite (UUID) será usado como identificador único. Um usuário só pode ter 1 convite ativo por organização. Não é possível convidar um usuário que já é membro da organização. Um email será enviado automaticamente para o convidado com o link de aceitação.',
		}),
		ApiBody({
			type: CreateOrganizationInviteDto,
			description: 'Dados para criação de convite',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Convite criado com sucesso e email enviado.',
			type: OrganizationInvite,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para criação de convite, ou já existe um convite ativo, ou o usuário já é membro da organização.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao criar convite.',
		}),
	);
}
