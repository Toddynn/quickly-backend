import { Body, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from '@/modules/auth/shared/decorators/public.decorator';
import { ResetPasswordDto } from '../../models/dto/input/reset-password.dto';
import { ResetPasswordDocs } from './docs';
import { ResetPasswordUseCase } from './reset-password.use-case';

@ApiTags('Password Reset')
@Public()
@Controller('password-reset')
export class ResetPasswordController {
	constructor(
		@Inject(ResetPasswordUseCase)
		private readonly resetPasswordUseCase: ResetPasswordUseCase,
	) {}

	@Post('reset')
	@ResetPasswordDocs()
	async execute(
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
		@Body() resetPasswordDto: ResetPasswordDto,
	): Promise<{ message: string }> {
		await this.resetPasswordUseCase.execute(request, response, resetPasswordDto);
		return { message: 'Senha redefinida com sucesso.' };
	}
}
