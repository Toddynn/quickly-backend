import { Module } from '@nestjs/common';
import { SessionConfigService } from './session-config.service';

@Module({
	providers: [SessionConfigService],
	exports: [SessionConfigService],
})
export class SessionConfigModule {}
