import { Inject, Injectable } from '@nestjs/common';
import { hashPassword } from '@/shared/helpers/hash-password.helper';
import type { CreateUserDto } from '../../models/dto/input/create-user.dto';
import type { User } from '../../models/entities/user.entity';
import type { UsersRepositoryInterface } from '../../models/interfaces/users-repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class CreateUserUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
	) {}

	async execute(createUserDto: CreateUserDto): Promise<User> {
		const passwordHash = await hashPassword(createUserDto.password);
		const user = this.usersRepository.create({
			...createUserDto,
			password: passwordHash,
		});

		return await this.usersRepository.save(user);
	}
}
