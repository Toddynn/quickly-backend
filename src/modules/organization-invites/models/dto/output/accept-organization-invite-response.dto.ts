import { ApiProperty } from '@nestjs/swagger';

export class AcceptOrganizationInviteResponseDto {
	@ApiProperty({
		description: 'Success message confirming the invite was accepted',
		example: 'Convite aceito com sucesso. Usuário vinculado à organização.',
	})
	message: string;
}

