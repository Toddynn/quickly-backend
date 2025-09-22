import { registerAs } from '@nestjs/config';

export default registerAs('pg_db', () => ({
     host: process.env.DB_PG_HOST,
     port: process.env.DB_PG_PORT || 5432,
     username: process.env.DB_PG_USERNAME,
     password: process.env.DB_PG_PASSWORD,
     database: process.env.DB_PG_NAME,
     schema: process.env.DB_PG_SCHEMA,
     sync: process.env.DB_PG_SYNC,
}));
