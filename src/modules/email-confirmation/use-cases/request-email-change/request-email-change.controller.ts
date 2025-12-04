import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestEmailChangeDto } from '../../models/dto/input/request-email-change.dto';
import { RequestEmailChangeDocs } from './docs';
import { RequestEmailChangeUseCase } from './request-email-change.use-case';

@ApiTags('Email Confirmation')
@Controller('email-confirmation')
export class RequestEmailChangeController {
	constructor(
		@Inject(RequestEmailChangeUseCase)
		private readonly requestEmailChangeUseCase: RequestEmailChangeUseCase,
	) {}

	@Post('request-email-change')
	@RequestEmailChangeDocs()
	async execute(@Body() requestEmailChangeDto: RequestEmailChangeDto): Promise<{ message: string }> {
		await this.requestEmailChangeUseCase.execute(requestEmailChangeDto);
		return { message: 'Código OTP enviado para o email atual.' };
	}
}

