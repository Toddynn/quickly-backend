import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { SendEmailUseCase } from './use-cases/send-email/send-email.use-case';

@Module({
	imports: [MailerModule],
	providers: [SendEmailUseCase],
	exports: [SendEmailUseCase],
})
export class EmailModule {}
