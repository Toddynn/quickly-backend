import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationMemberDto } from '../../models/dto/create-organization-member.dto';
import { OrganizationMember } from '../../models/entities/organization-member.entity';

export function CreateOrganizationMemberDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cria um novo membro da organização',
			description: 'Vincula um usuário a uma organização como membro.',
		}),
		ApiBody({
			type: CreateOrganizationMemberDto,
			description: 'Dados para criação de membro da organização',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Membro da organização criado com sucesso.',
			type: OrganizationMember,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para criação de membro da organização.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao criar membro da organização.',
		}),
	);
}
