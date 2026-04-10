import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProfilePictureResponseDto } from '../../models/dto/output/update-profile-picture-response.dto';

export function UpdateProfilePictureDocs() {
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiOperation({
			summary: 'Atualizar foto de perfil',
			description: 'Envia uma nova imagem de perfil para o usuário autenticado no contexto da organização ativa. Tamanho máximo: 10MB.',
		}),
		ApiBody({
			schema: {
				type: 'object',
				required: ['file'],
				properties: {
					file: {
						type: 'string',
						format: 'binary',
						description: 'Arquivo de imagem (JPEG, PNG, WebP ou GIF)',
					},
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Foto de perfil atualizada. Por organização existe no máximo uma mídia de perfil; a resposta inclui essa mídia na lista `medias`.',
			type: UpdateProfilePictureResponseDto,
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Arquivo inválido, ausente ou acima do limite de 10MB.',
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
			description: 'Usuário não encontrado.',
		}),
	);
}
