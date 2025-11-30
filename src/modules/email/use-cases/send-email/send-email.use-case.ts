import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import type { SendEmailDto } from '../../models/dto/send-email.dto';

@Injectable()
export class SendEmailUseCase {
	constructor(
		@Inject(MailerService)
		private readonly mailerService: MailerService,
	) {}

	async execute(data: SendEmailDto): Promise<void> {
		await this.mailerService.sendMail(data);
	}
}
