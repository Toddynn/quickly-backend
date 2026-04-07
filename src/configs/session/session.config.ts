import { registerAs } from '@nestjs/config';
import { env } from '@/shared/constants/env-variables';

export default registerAs('session', () => ({
	redisHost: env.REDIS_DOMAIN,
	redisPort: env.REDIS_PORT,
	redisPrefix: env.REDIS_SESSION_PREFIX,
	redisTtl: env.REDIS_TTL,
	sessionName: env.SESSION_NAME,
	sessionSecret: env.SESSION_SECRET,
}));
