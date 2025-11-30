import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, BeforeInsert, PrimaryColumn } from 'typeorm';
import { v7 } from 'uuid';

export abstract class UUIDV7BaseEntity extends BaseEntity {
	@PrimaryColumn({ name: 'id' })
	@ApiProperty({ description: 'The UUID v7 of the entity' })
	id: string;

	@BeforeInsert()
	generateUUID() {
		this.id = v7();
	}
}
