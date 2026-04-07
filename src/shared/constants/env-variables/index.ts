import 'dotenv/config';
import { coerce, object, string } from 'zod/v4-mini';

const envSchema = object({
	APP_NAME: string({ error: 'APP_NAME is required.' }),

	APP_PROTOCOL: string({ error: 'APP_PROTOCOL is required.' }),
	APP_DOMAIN: string({ error: 'APP_DOMAIN is required.' }),
	APP_PORT: string({ error: 'APP_PORT is required.' }),

	FRONT_END_PROTOCOL: string({ error: 'FRONT_END_PROTOCOL is required.' }),
	FRONT_END_DOMAIN: string({ error: 'FRONT_END_DOMAIN is required.' }),
	FRONT_END_PORT: string({ error: 'FRONT_END_PORT is required.' }),

	DB_HOST: string({ error: 'DB_HOST is required.' }),
	DB_PORT: coerce.number({
		error: 'DB_PORT is required.',
	}),
	DB_USER: string({ error: 'DB_USER is required.' }),
	DB_PASSWORD: string({ error: 'DB_PASSWORD is required.' }),
	DB_DATABASE: string({ error: 'DB_DATABASE is required.' }),
	DB_SCHEMA: string({ error: 'DB_SCHEMA is required.' }),
	DB_SYNC: string({ error: 'DB_SYNC is required.' }),

	JWT_SECRET: string({ error: 'JWT_SECRET is required.' }),
	JWT_EXPIRES_IN: coerce.number({ error: 'JWT_EXPIRES_IN is required.' }),
	JWT_REFRESH_SECRET: string({ error: 'JWT_REFRESH_SECRET is required.' }),
	JWT_REFRESH_EXPIRES_IN: coerce.number({ error: 'JWT_REFRESH_EXPIRES_IN is required.' }),

	SALT_ROUNDS: coerce.number({ error: 'SALT_ROUNDS is required.' }),

	MAIL_HOST: string({ error: 'MAIL_HOST is required.' }),
	MAIL_SMTP_PORT: coerce.number({ error: 'MAIL_SMTP_PORT is required.' }),
	MAIL_WEB_PORT: coerce.number({ error: 'MAIL_WEB_PORT is required.' }),
	MAIL_USERNAME: string({ error: 'MAIL_USERNAME is required.' }),
	MAIL_PASSWORD: string({ error: 'MAIL_PASSWORD is required.' }),
	MAIL_SECURE: string({ error: 'MAIL_SECURE is required.' }),
	MAIL_FROM_NAME: string({ error: 'MAIL_FROM_NAME is required.' }),
	MAIL_FROM_EMAIL: string({ error: 'MAIL_FROM_EMAIL is required.' }),
	MAIL_IGNORE_TLS: string({ error: 'MAIL_IGNORE_TLS is required.' }),

	REDIS_DOMAIN: string({ error: 'REDIS_DOMAIN is required.' }),
	REDIS_PORT: coerce.number({ error: 'REDIS_PORT is required.' }),
	REDIS_SESSION_PREFIX: string({ error: 'REDIS_SESSION_PREFIX is required.' }),
	REDIS_TTL: coerce.number({ error: 'REDIS_TTL is required.' }),

	SESSION_SECRET: string({ error: 'SESSION_SECRET is required.' }),
	SESSION_NAME: string({ error: 'SESSION_NAME is required.' }),
});

const rawEnv = {
	APP_NAME: process.env.APP_NAME,

	APP_PROTOCOL: process.env.APP_PROTOCOL,
	APP_DOMAIN: process.env.APP_DOMAIN,
	APP_PORT: process.env.APP_PORT,

	FRONT_END_PROTOCOL: process.env.FRONT_END_PROTOCOL,
	FRONT_END_DOMAIN: process.env.FRONT_END_DOMAIN,
	FRONT_END_PORT: process.env.FRONT_END_PORT,

	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	DB_DATABASE: process.env.DB_DATABASE,
	DB_SCHEMA: process.env.DB_SCHEMA,
	DB_SYNC: process.env.DB_SYNC,

	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

	SALT_ROUNDS: process.env.SALT_ROUNDS,

	MAIL_HOST: process.env.MAIL_HOST,
	MAIL_SMTP_PORT: process.env.MAIL_SMTP_PORT,
	MAIL_WEB_PORT: process.env.MAIL_WEB_PORT,
	MAIL_USERNAME: process.env.MAIL_USERNAME,
	MAIL_PASSWORD: process.env.MAIL_PASSWORD,
	MAIL_SECURE: process.env.MAIL_SECURE,
	MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
	MAIL_FROM_EMAIL: process.env.MAIL_FROM_EMAIL,
	MAIL_IGNORE_TLS: process.env.MAIL_IGNORE_TLS,

	REDIS_DOMAIN: process.env.REDIS_DOMAIN,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_SESSION_PREFIX: process.env.REDIS_SESSION_PREFIX,
	REDIS_TTL: process.env.REDIS_TTL,

	SESSION_SECRET: process.env.SESSION_SECRET,
	SESSION_NAME: process.env.SESSION_NAME,
} as const;

export const env = envSchema.parse(rawEnv);

const with_port = (protocol: string, domain: string, port?: string) => (port ? `${protocol}://${domain}:${port}` : `${protocol}://${domain}`);

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const BACK_END_URL = with_port(env.APP_PROTOCOL, env.APP_DOMAIN, env.APP_PORT);
export const FRONT_END_URL = with_port(env.FRONT_END_PROTOCOL, env.FRONT_END_DOMAIN, env.FRONT_END_PORT);
