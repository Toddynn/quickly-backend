import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';
import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';

export class MediaReferenceDto extends TimestampedEntityDto {
	@ApiProperty()
	organization_id: string;

	@ApiProperty({ enum: MediaOwnerType })
	owner_type: MediaOwnerType;

	@ApiProperty()
	owner_id: string;

	@ApiPropertyOptional()
	user_id?: string | null;

	@ApiPropertyOptional({ description: 'Presente quando a mídia pertence a um serviço da organização' })
	organization_service_id?: string | null;

	@ApiProperty({ description: 'URL pré-assinada para leitura (preenchida na resposta da API, não persistida)' })
	url: string;

	@ApiProperty()
	mime_type: string;

	@ApiProperty()
	extension: string;
}
