import { Inject, Injectable } from '@nestjs/common';
import type { UpdateUserDto } from '../../models/dto/update-user.dto';
import type { User } from '../../models/entities/user.entity';
import type { UsersRepositoryInterface } from '../../models/interfaces/repository.interface';
import { USER_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';

@Injectable()
export class UpdateUserUseCase {
	constructor(
		@Inject(USER_REPOSITORY_INTERFACE_KEY)
		private readonly usersRepository: UsersRepositoryInterface,
	) {}

	async execute(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
		await this.usersRepository.update(userId, updateUserDto);

		const updatedUser = await this.usersRepository.findOne({
			where: { id: userId },
		});

		if (!updatedUser) {
			throw new Error('Usuário não encontrado após atualização.');
		}

		return updatedUser;
	}
}

