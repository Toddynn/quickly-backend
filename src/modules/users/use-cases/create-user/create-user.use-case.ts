import { createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import type { CreateUserDto } from '../../models/dto/create-user.dto';
import type { User } from '../../models/entities/user.entity';
import type { UsersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class CreateUserUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
	) {}

	async execute(createUserDto: CreateUserDto): Promise<User> {
		const passwordHash = createHash('sha256').update(createUserDto.password).digest('hex');

		const user = this.usersRepository.create({
			...createUserDto,
			password: passwordHash,
		});

		return await this.usersRepository.save(user);
	}
}
