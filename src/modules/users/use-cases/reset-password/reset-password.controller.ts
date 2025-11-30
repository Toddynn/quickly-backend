import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResetPasswordDto } from '../../models/dto/reset-password.dto';
import { ResetPasswordDocs } from './docs';
import { ResetPasswordUseCase } from './reset-password.use-case';

@ApiTags('Users')
@Controller('users')
export class ResetPasswordController {
	constructor(
		@Inject(ResetPasswordUseCase)
		private readonly resetPasswordUseCase: ResetPasswordUseCase,
	) {}

	@Post('password-reset/reset')
	@ResetPasswordDocs()
	async execute(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
		await this.resetPasswordUseCase.execute(resetPasswordDto);
		return { message: 'Senha redefinida com sucesso.' };
	}
}
