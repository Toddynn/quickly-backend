import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import pgDatabaseConfig from './configs/database/pg-database.config';
import { PgTypeOrmConfigService } from './configs/database/pg-typeorm-config.service';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env'],
			load: [pgDatabaseConfig],
		}),
		TypeOrmModule.forRootAsync({
			useFactory: (configService: ConfigService) => {
				const service = new PgTypeOrmConfigService(configService);
				return service.createTypeOrmOptions();
			},
			inject: [ConfigService],
		}),
		UsersModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
