import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MediaReferenceDto } from '@/modules/media/models/dto/output/media-reference.dto';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';

export class UserWithMediasResponseDto extends TimestampedEntityDto {
	@ApiProperty({ description: 'Nome do usuário' })
	name: string;

	@ApiProperty({ description: 'E-mail do usuário' })
	email: string;

	@ApiPropertyOptional({ description: 'Telefone do usuário' })
	phone?: string;

	@ApiProperty({ description: 'E-mail verificado' })
	email_verified: boolean;

	@ApiProperty({
		type: [MediaReferenceDto],
		description: 'Mídias do usuário na organização ativa (URLs pré-assinadas para leitura)',
	})
	medias: MediaReferenceDto[];
}
