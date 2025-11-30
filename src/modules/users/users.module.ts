import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './models/entities/user.entity';
import { UsersRepository } from './repository/users.repository';
import { USER_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { CreateUserController } from './use-cases/create-user/create-user.controller';
import { CreateUserUseCase } from './use-cases/create-user/create-user.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [CreateUserController],
	providers: [
		{
			provide: USER_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => {
				return new UsersRepository(dataSource);
			},
			inject: [DataSource],
		},
		CreateUserUseCase,
	],
	exports: [USER_REPOSITORY_INTERFACE_KEY],
})
export class UsersModule {}
