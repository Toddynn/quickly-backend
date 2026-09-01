import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import pgDatabaseConfig from './configs/database/pg-database.config';
import { PgTypeOrmConfigService } from './configs/database/pg-typeorm-config.service';
import mailerConfig from './configs/mailer/mailer.config';
import { MailerConfigService } from './configs/mailer/mailer-config.service';
import sessionConfig from './configs/session/session.config';
import { SessionConfigModule } from './configs/session/session-config.module';
import { AbacatePayModule } from './modules/abacate-pay/abacate-pay.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuthModule } from './modules/auth/auth.module';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { SessionAuthGuard } from './modules/auth/guards/session-auth.guard';
import { SubscriptionStatusGuard } from './modules/auth/guards/subscription-status.guard';
import { TenantGuard } from './modules/auth/guards/tenant.guard';
import { CustomerModule } from './modules/customer/customer.module';
import { EmailModule } from './modules/email/email.module';
import { EmailConfirmationModule } from './modules/email-confirmation/email-confirmation.module';
import { MediaModule } from './modules/media/media.module';
import { OrganizationAddressesModule } from './modules/organization-addresses/organization-addresses.module';
import { OrganizationInvitesModule } from './modules/organization-invites/organization-invites.module';
import { OrganizationMembersModule } from './modules/organization-members/organization-members.module';
import { OrganizationServicesModule } from './modules/organization-services/organization-services.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { PasswordResetModule } from './modules/password-reset/password-reset.module';
import { PlansModule } from './modules/plans/plans.module';
import { ServiceCategoriesModule } from './modules/service-categories/service-categories.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UsersModule } from './modules/users/users.module';
import { WorkingHoursModule } from './modules/working-hours/working-hours.module';
import { AppCacheModule } from './shared/cache/app-cache.module';
import { ReflectionGuardValidationPipe } from './shared/pipes/safe-validation.pipe';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env'],
			load: [pgDatabaseConfig, mailerConfig, sessionConfig],
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
		SessionConfigModule,
		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 60000,
					limit: 10,
				},
			],
		}),
		ScheduleModule.forRoot(),
		AppCacheModule,
		AbacatePayModule,
		AuthModule,
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
		MediaModule,
		PlansModule,
		SubscriptionsModule,
		WorkingHoursModule,
		AppointmentsModule,
	],
	providers: [
		ReflectionGuardValidationPipe,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		{
			provide: APP_GUARD,
			useClass: SessionAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: TenantGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		{
			provide: APP_GUARD,
			useClass: SubscriptionStatusGuard,
		},
	],
})
export class AppModule {}
