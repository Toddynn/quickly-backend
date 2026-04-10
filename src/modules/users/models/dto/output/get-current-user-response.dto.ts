import { ApiProperty } from '@nestjs/swagger';
import { UserWithMediasResponseDto } from './user-with-medias-response.dto';
import { ActiveOrganizationSummaryDto } from './active-organization-summary.dto';

export class GetCurrentUserResponseDto extends UserWithMediasResponseDto {
	@ApiProperty({
		type: ActiveOrganizationSummaryDto,
		description: 'Organização ativa na sessão (tenant em que o usuário está logado)',
	})
	organization: ActiveOrganizationSummaryDto;
}
