import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface SendEmailDto {
	to: string;
	subject: string;
	html: string;
}

@Injectable()
export class SendEmailUseCase {
	constructor(
		@Inject(MailerService)
		private readonly mailerService: MailerService,
	) {}

	async execute(data: SendEmailDto): Promise<void> {
		await this.mailerService.sendMail({
			to: data.to,
			subject: data.subject,
			html: data.html,
		});
	}
}
