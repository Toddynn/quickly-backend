import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../../models/dto/create-user.dto';
import { User } from '../../models/entities/user.entity';

export function CreateUserDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Cria um novo usuário',
			description: 'Cria um novo usuário com nome, e-mail e senha. O e-mail é validado quanto à unicidade.',
		}),
		ApiBody({
			type: CreateUserDto,
			description: 'Dados para criação de usuário',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'Usuário criado com sucesso.',
			type: User,
		}),
		ApiResponse({
			status: HttpStatus.CONFLICT,
			description: 'Conflito de dados. O e-mail informado já está em uso.',
			schema: {
				examples: {
					email_duplicado: {
						summary: 'E-mail já cadastrado',
						value: {
							message: 'E-mail usuario@email.com já em uso!',
						},
					},
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Dados inválidos para criação de usuário.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Erro inesperado ao criar usuário.',
		}),
	);
}
