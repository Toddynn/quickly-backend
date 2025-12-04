import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import pgDatabaseConfig from './configs/database/pg-database.config';
import { PgTypeOrmConfigService } from './configs/database/pg-typeorm-config.service';
import mailerConfig from './configs/mailer/mailer.config';
import { MailerConfigService } from './configs/mailer/mailer-config.service';
import { CustomerModule } from './modules/customer/customer.module';
import { EmailModule } from './modules/email/email.module';
import { EmailConfirmationModule } from './modules/email-confirmation/email-confirmation.module';
import { OrganizationAddressesModule } from './modules/organization-addresses/organization-addresses.module';
import { OrganizationInvitesModule } from './modules/organization-invites/organization-invites.module';
import { OrganizationMembersModule } from './modules/organization-members/organization-members.module';
import { OrganizationServicesModule } from './modules/organization-services/organization-services.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PasswordResetModule } from './modules/password-reset/password-reset.module';
import { ServiceCategoriesModule } from './modules/service-categories/service-categories.module';
import { UsersModule } from './modules/users/users.module';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env'],
			load: [pgDatabaseConfig, mailerConfig],
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
		PasswordResetModule,
		OrganizationsModule,
		OrganizationMembersModule,
		OrganizationInvitesModule,
		OrganizationAddressesModule,
		ServiceCategoriesModule,
		OrganizationServicesModule,
		EmailModule,
		EmailConfirmationModule,
		CustomerModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
