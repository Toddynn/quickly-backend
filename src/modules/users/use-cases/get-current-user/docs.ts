import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCurrentUserResponseDto } from '../../models/dto/output/get-current-user-response.dto';

export function GetCurrentUserDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Dados do usuário autenticado',
			description:
				'Retorna o usuário a partir do banco, a organização ativa na sessão e as mídias do usuário nesse tenant. As URLs de mídia são pré-assinadas.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Usuário e contexto do tenant encontrados.',
			type: GetCurrentUserResponseDto,
		}),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: 'Usuário não autenticado.',
		}),
		ApiResponse({
			status: HttpStatus.FORBIDDEN,
			description: 'Organização ativa não definida na sessão.',
		}),
		ApiResponse({
			status: HttpStatus.NOT_FOUND,
			description: 'Usuário ou organização ativa não encontrada no banco.',
		}),
	);
}
