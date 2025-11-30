import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from '../../models/dto/update-user.dto';
import { User } from '../../models/entities/user.entity';

export function UpdateUserDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Atualiza dados do usuário',
			description:
				'Atualiza os dados do usuário (nome e/ou telefone). A senha não pode ser alterada através deste endpoint. Use o fluxo de recuperação de senha para alterar a senha.',
		}),
		ApiParam({
			name: 'id',
			description: 'ID do usuário a ser atualizado',
			type: String,
		}),
		ApiBody({
			type: UpdateUserDto,
			description: 'Dados para atualização do usuário',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Usuário atualizado com sucesso.',
			type: User,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para atualização do usuário.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Usuário não encontrado.',
			schema: {
				example: {
					message: 'User não encontrado com os critérios: {"id":"..."}',
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao atualizar usuário.',
		}),
	);
}

