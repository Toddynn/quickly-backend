import { ApiProperty } from '@nestjs/swagger';

export class CheckSlugAvailabilityResponseDto {
	@ApiProperty({ description: 'The generated or provided slug' })
	slug: string;

	@ApiProperty({ description: 'Whether the slug is available (not taken by another organization)' })
	available: boolean;
}


