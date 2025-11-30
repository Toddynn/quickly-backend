import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UUIDV7BaseEntity } from './uuid-v7-base.entity';

export abstract class TimestampedEntity extends UUIDV7BaseEntity {
	@CreateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
		name: 'created_at',
	})
	@ApiProperty({ description: 'The date and time when entity was created' })
	created_at: Date;

	@UpdateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
		onUpdate: 'CURRENT_TIMESTAMP',
		name: 'updated_at',
	})
	@ApiProperty({ description: 'The date and time when entity was updated' })
	updated_at: Date;
}
