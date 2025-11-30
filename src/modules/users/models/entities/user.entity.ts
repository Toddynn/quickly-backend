import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('users')
export class User extends TimestampedEntity {
	@Column()
	@ApiProperty({ description: 'The name of the user' })
	name: string;

	@Column({ unique: true })
	@ApiProperty({ description: 'The email of the user' })
	email: string;

	@Column({ select: false })
	@ApiProperty({ description: 'The password of the user' })
	password: string;

	@Column({ nullable: true })
	@ApiProperty({ description: 'The phone of the user' })
	phone: string;
}
