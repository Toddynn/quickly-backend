import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import pgDatabaseConfig from './configs/database/pg-database.config';
import { PgTypeOrmConfigService } from './configs/database/pg-typeorm-config.service';
import { MailerConfigService } from './configs/mailer/mailer-config.service';
import { OrganizationInvitesModule } from './modules/organization-invites/organization-invites.module';
import { OrganizationMembersModule } from './modules/organization-members/organization-members.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
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
		MailerModule.forRootAsync({
			useFactory: (configService: ConfigService) => {
				const service = new MailerConfigService(configService);
				return service.createMailerOptions();
			},
			inject: [ConfigService],
		}),
		UsersModule,
		OrganizationsModule,
		OrganizationMembersModule,
		OrganizationInvitesModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
