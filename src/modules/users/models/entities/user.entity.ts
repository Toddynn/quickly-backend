import { Column, Entity } from 'typeorm';
import { TimestampedEntity } from '@/shared/entities/timestamped.entity';

@Entity('users')
export class User extends TimestampedEntity {
	@Column({ name: 'name' })
	name: string;

	@Column({ unique: true, name: 'email' })
	email: string;

	@Column({ select: false, name: 'password' })
	password: string;

	@Column({ nullable: true, name: 'phone' })
	phone: string;
}
