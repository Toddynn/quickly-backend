import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateOrganizationDto } from '../../models/dto/update-organization.dto';
import { Organization } from '../../models/entities/organization.entity';

export function UpdateOrganizationDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Atualiza uma organização',
			description: 'Atualiza os dados de uma organização existente.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID da organização',
			type: String,
		}),
		ApiBody({
			type: UpdateOrganizationDto,
			description: 'Dados para atualização de organização',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organização atualizada com sucesso.',
			type: Organization,
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Organização não encontrada.',
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para atualização de organização.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao atualizar organização.',
		}),
	);
}
