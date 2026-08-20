import { Global, Module } from '@nestjs/common';
import { SessionConfigModule } from '@/configs/session/session-config.module';
import { AppCacheService } from './app-cache.service';

@Global()
@Module({
	imports: [SessionConfigModule],
	providers: [AppCacheService],
	exports: [AppCacheService],
})
export class AppCacheModule {}
