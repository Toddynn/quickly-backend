import { Injectable } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService {
	constructor(private readonly configService: ConfigService) {}

	createMailerOptions() {
		const fromEmail = this.configService.get<string>('mailer.fromEmail');
		const fromName = this.configService.get<string>('mailer.fromName');
		const from = fromName && fromEmail ? `${fromName} <${fromEmail}>` : fromEmail;

		return {
			transport: {
				host: this.configService.get<string>('mailer.host'),
				port: this.configService.get<number>('mailer.port'),
				auth: {
					user: this.configService.get<string>('mailer.user'),
					pass: this.configService.get<string>('mailer.pass'),
				},
				secure: this.configService.get<boolean>('mailer.secure'),
				ignoreTls: this.configService.get<boolean>('mailer.ignoreTls'),
			},
			defaults: {
				from: from,
			},
		};
	}
}
