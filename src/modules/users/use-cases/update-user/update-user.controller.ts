import { Body, Controller, Inject, Patch } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { CurrentUser } from '@/modules/auth/shared/decorators/current-user.decorator';
import { UpdateUserDto } from '../../models/dto/input/update-user.dto';
import { UpdateUserDocs } from './docs';
import { UpdateUserUseCase } from './update-user.use-case';

@ApiTags('Users')
@ApiCookieAuth()
@Controller('users')
export class UpdateUserController {
	constructor(
		@Inject(UpdateUserUseCase)
		private readonly updateUserUseCase: UpdateUserUseCase,
	) {}

	@Patch()
	@UpdateUserDocs()
	async execute(@CurrentUser() user: SessionUser, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
		return await this.updateUserUseCase.execute(user.userId, updateUserDto);
	}
}
