import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProfilePictureResponseDto } from '../../models/dto/output/update-profile-picture-response.dto';

export function DeleteProfilePictureDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Remover foto de perfil',
			description: 'Remove a mídia de perfil do usuário autenticado na organização ativa (tenant).',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Foto de perfil removida. A lista `medias` reflete as mídias restantes do usuário nesse tenant.',
			type: UpdateProfilePictureResponseDto,
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
