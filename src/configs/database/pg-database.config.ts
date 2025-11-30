import { registerAs } from '@nestjs/config';

export default registerAs('pg_db', () => ({
	host: process.env.DB_HOST ,
	port: parseInt(process.env.DB_PORT , 10),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	schema: process.env.DB_SCHEMA,
	sync: process.env.DB_SYNC === 'true',
}));
