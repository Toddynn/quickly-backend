import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../../models/dto/create-user.dto';
import { User } from '../../models/entities/user.entity';

export function CreateUserDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Create a new user',
			description: 'Creates a new user with name, email and password. The email is validated for uniqueness.',
		}),
		ApiBody({
			type: CreateUserDto,
			description: 'Data for user creation',
		}),
		ApiResponse({
			status: HttpStatus.CREATED,
			description: 'User created successfully.',
			type: User,
		}),
		ApiResponse({
			status: HttpStatus.CONFLICT,
			description: 'Data conflict. The provided email is already in use.',
			schema: {
				examples: {
					email_duplicado: {
						summary: 'Email already registered',
						value: {
							message: 'E-mail usuario@email.com já em uso!',
						},
					},
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for user creation.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while creating user.',
		}),
	);
}
