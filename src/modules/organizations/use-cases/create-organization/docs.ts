import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrganizationDto } from '../../models/dto/create-organization.dto';
import { Organization } from '../../models/entities/organization.entity';

export function CreateOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cria uma nova organização',
			description:
				'Cria uma nova organização com nome, descrição, logo e owner_id. O criador (owner_id) é automaticamente adicionado como membro da organização.',
		}),
		ApiBody({
			type: CreateOrganizationDto,
			description: 'Dados para criação de organização',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Organização criada com sucesso.',
			type: Organization,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para criação de organização.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao criar organização.',
		}),
	);
}
