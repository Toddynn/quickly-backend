import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TimestampedEntityDto } from '@/shared/dto/timestamped-entity.dto';
import { SubscriptionStatus } from '../../../shared/enums/subscription-status.enum';

export class SubscriptionDto extends TimestampedEntityDto {
	@ApiProperty() organization_id: string;
	@ApiProperty() plan_id: string;
	@ApiProperty({ enum: SubscriptionStatus }) status: SubscriptionStatus;
	@ApiPropertyOptional() trial_ends_at?: Date;
	@ApiPropertyOptional() current_period_end?: Date;
	@ApiPropertyOptional() canceled_at?: Date;
}
