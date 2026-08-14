import type { AbacatePay as AbacatePayFn } from '@abacatepay/sdk';
import { Module } from '@nestjs/common';
import { env } from '@/shared/constants/env-variables';
import { ABACATE_PAY_CLIENT } from './abacate-pay.constants';
import { AbacatePayService } from './abacate-pay.service';

// @abacatepay/sdk é ESM-only ("type": "module", sem condição "require" no exports map).
// Este projeto compila para CommonJS, e um `import` estático é rebaixado pelo TS para
// `require(...)`, que quebra com ERR_PACKAGE_PATH_NOT_EXPORTED contra um pacote ESM-only.
// `import()` dinâmico também seria rebaixado para essa mesma chamada require() sob "module":
// "commonjs". O `new Function(...)` abaixo evita o rebaixamento do TS e força um
// `import()` nativo do V8/Node em runtime, que sabe carregar ESM a partir de um módulo CJS.
const importAbacatePaySdk = new Function('return import("@abacatepay/sdk")') as () => Promise<{ AbacatePay: typeof AbacatePayFn }>;

@Module({
	providers: [
		{
			provide: ABACATE_PAY_CLIENT,
			useFactory: async () => {
				const { AbacatePay } = await importAbacatePaySdk();
				return AbacatePay({ secret: env.ABACATE_PAY_SECRET_KEY });
			},
		},
		AbacatePayService,
	],
	exports: [AbacatePayService],
})
export class AbacatePayModule {}
