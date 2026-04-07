import { registerAs } from '@nestjs/config';
import { env } from '@/shared/constants/env-variables';

export default registerAs('mailer', () => ({
	host: env.MAIL_HOST,
	smtpPort: env.MAIL_SMTP_PORT ?? 1025,
	user: env.MAIL_USERNAME,
	pass: env.MAIL_PASSWORD,
	secure: env.MAIL_SECURE === 'true',
	fromName: env.MAIL_FROM_NAME ?? 'No-Reply',
	fromEmail: env.MAIL_FROM_EMAIL ?? 'no-reply@quickly.com',
	ignoreTls: env.MAIL_IGNORE_TLS === 'true',
}));
