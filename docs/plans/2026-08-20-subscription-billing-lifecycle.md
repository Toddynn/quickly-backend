# Subscription Billing Lifecycle Implementation Plan

> **For agentic workers:** Execute this plan task-by-task, in order. Steps use checkbox (`- [ ]`) syntax for tracking. Tasks 1–5 are independent of each other and can be built/reviewed in any order; Task 6 depends on the controller created in Task 2; Task 7 depends on all previous tasks being merged.

**Goal:** Close the gap between "AbacatePay confirms a payment" and "the app actually enforces plan billing" — cover the ANNUAL (Pix, one-time checkout) purchase flow end-to-end, and make `subscription.status` actually gate access for both billing cycles.

**Architecture:** Follows the existing Clean Architecture convention in `quickly-backend` (NestJS): one use-case per operation, repository interfaces injected via string tokens, controllers thin, cross-cutting concerns as global `APP_GUARD`s. No new modules — everything lands inside the existing `subscriptions`, `abacate-pay` and `auth` modules.

**Tech Stack:** NestJS 10, TypeORM, `@abacatepay/sdk@2.0.3` / `@abacatepay/types@3.0.3`, `@nestjs/schedule` (cron), `@nestjs-modules/mailer`, Jest (manual mocks, no `@nestjs/testing` module bootstrapping — see existing specs).

## Global Constraints

- **Trust the installed `@abacatepay/types@3.0.3` package over the docs site when they disagree.** Confirmed this session: the docs site listed cycle values (`WEEKLY, MONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY`) and claimed a `subscription.payment_failed` webhook event exist; neither is true of the real installed types (`frequency.cycle` is `MONTHLY | YEARLY | WEEKLY | DAILY` on the SDK's internal contract, and `WebhookEventType` has no `payment_failed` member at all). Always grep `node_modules/.pnpm/@abacatepay+types@3.0.3/node_modules/@abacatepay/types/dist/v2/index.d.ts` before trusting a doc page for this API.
- **Recurring subscriptions only support the `CARD` method for real**, confirmed directly from `docs.abacatepay.com/pages/subscriptions/create`: *"Métodos de pagamento disponíveis. Assinaturas suportam apenas CARD."* There is no Pix Automático path. This is why the ANNUAL plan uses a one-time Pix checkout instead of a native recurring subscription — do not "simplify" this later by switching ANNUAL to a `cycle`-based subscription, it would silently switch billing to CARD and destroy the fee advantage the annual plan exists for.
- **AbacatePay never signals a failed card charge via webhook** — only success (`subscription.renewed`/`subscription.completed`) or terminal cancellation (`subscription.cancelled`). This is why `ExpireStaleSubscriptionsUseCase` exists as a polling cron rather than a webhook handler, and why the same pattern (poll `current_period_end`) is the only option for the Pix-avulso annual flow too — there is no webhook for "customer never paid the Pix charge" either.
- **`abacate_product_id` and `abacate_annual_product_id` on `Plan` are both required** (non-nullable) and sourced from env at boot (`ABACATE_PAY_PLAN_{SOLO,TEAM,STUDIO}_PRODUCT_ID` / `_ANNUAL_PRODUCT_ID`). Nothing in this plan creates AbacatePay Products at runtime — that already happened in a previous change (see `SeedPlansService`).
- **Known type gap:** `RESTPostCreateSubscriptionData`/`APISubscription` (the response of `subscriptions.create()`) does not declare the `url` field even though the real API returns it — see the cast in `create-subscription.use-case.ts`. This gap is specific to subscription creation; `APICheckout` (the response of `checkouts.create()`, used in Task 2 below) declares `url: string` correctly, no cast needed there.

---

## File Structure

New files:
- `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.use-case.ts` — creates a one-time Pix checkout for the ANNUAL plan.
- `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.use-case.spec.ts`
- `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.controller.ts`
- `src/modules/subscriptions/use-cases/create-annual-checkout/docs.ts`
- `src/modules/subscriptions/use-cases/send-renewal-reminder-emails/send-renewal-reminder-emails.use-case.ts` — daily cron, emails owners of ANNUAL subscriptions approaching `current_period_end`.
- `src/modules/subscriptions/use-cases/send-renewal-reminder-emails/send-renewal-reminder-emails.use-case.spec.ts`
- `src/modules/auth/guards/subscription-status.guard.ts` — new global guard blocking tenant-scoped routes when `subscription.status` isn't `ACTIVE`/`TRIALING`.
- `src/modules/auth/guards/subscription-status.guard.spec.ts`
- `src/modules/auth/shared/decorators/skip-subscription-guard.decorator.ts` — opt-out for the subscription-management endpoints themselves.

Modified files:
- `src/modules/abacate-pay/abacate-pay.service.ts` — add `createCheckout` wrapper.
- `src/modules/subscriptions/use-cases/create-subscription/create-subscription.use-case.ts` — fix stale comment (no behavior change).
- `src/modules/subscriptions/use-cases/handle-abacate-pay-webhook/handle-abacate-pay-webhook.use-case.ts` — handle `checkout.completed`.
- `src/modules/subscriptions/use-cases/handle-abacate-pay-webhook/handle-abacate-pay-webhook.use-case.spec.ts` — **new file**, this use-case has zero test coverage today.
- `src/modules/subscriptions/use-cases/handle-abacate-pay-webhook/abacate-pay-webhook.controller.ts` — type the payload as `WebhookEvent`.
- `src/modules/subscriptions/use-cases/expire-stale-subscriptions/expire-stale-subscriptions.use-case.ts` — split the EXPIRED grace window by `billing_cycle`.
- `src/modules/subscriptions/use-cases/expire-stale-subscriptions/expire-stale-subscriptions.use-case.spec.ts` — **new file**.
- `src/modules/subscriptions/models/entities/subscription.entity.ts` — add `last_renewal_reminder_days_before`.
- `src/modules/subscriptions/subscriptions.module.ts` — register the 2 new use-cases/controller.
- `src/modules/subscriptions/use-cases/get-organization-subscription/get-organization-subscription.controller.ts` — add `@SkipSubscriptionGuard()`.
- `src/modules/subscriptions/use-cases/change-subscription-plan/change-subscription-plan.controller.ts` — add `@SkipSubscriptionGuard()`.
- `src/modules/subscriptions/use-cases/cancel-subscription/cancel-subscription.controller.ts` — add `@SkipSubscriptionGuard()`.
- `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.controller.ts` — add `@SkipSubscriptionGuard()` (in Task 6, after Task 2 created it without the decorator).
- `src/app.module.ts` — register `SubscriptionStatusGuard` as a 4th `APP_GUARD`.
- `docs/ARCHITECTURE.md` — sync per `.claude/rules/documentation-sync.md`.

---

### Task 1: AbacatePayService — add `createCheckout` wrapper

**Files:**
- Modify: `src/modules/abacate-pay/abacate-pay.service.ts`
- Modify: `src/modules/subscriptions/use-cases/create-subscription/create-subscription.use-case.ts:53-54` (comment fix only)
- Test: `src/modules/abacate-pay/abacate-pay.service.spec.ts` (new file — none exists today)

**Interfaces:**
- Produces: `AbacatePayService.createCheckout(body: RESTPostCreateNewCheckoutBody): Promise<APICheckout>` — consumed by Task 2.

- [ ] **Step 1: Write the failing test**

```typescript
// src/modules/abacate-pay/abacate-pay.service.spec.ts
import type { AbacatePay as AbacatePayClient } from '@abacatepay/sdk';
import { BadGatewayException } from '@nestjs/common';
import { AbacatePayService } from './abacate-pay.service';

type MockClient = { checkouts: { create: jest.Mock } };

describe('AbacatePayService.createCheckout', () => {
	let client: MockClient;
	let service: AbacatePayService;

	beforeEach(() => {
		client = { checkouts: { create: jest.fn() } };
		service = new AbacatePayService(client as unknown as ReturnType<typeof AbacatePayClient>);
	});

	it('deve retornar os dados do checkout quando a API responde com sucesso', async () => {
		client.checkouts.create.mockResolvedValue({ success: true, data: { id: 'checkout_1', url: 'https://pay.abacatepay.com/checkout_1' } });

		const result = await service.createCheckout({ items: [{ id: 'prod_1', quantity: 1 }] });

		expect(client.checkouts.create).toHaveBeenCalledWith({ items: [{ id: 'prod_1', quantity: 1 }] });
		expect(result).toEqual({ id: 'checkout_1', url: 'https://pay.abacatepay.com/checkout_1' });
	});

	it('deve lançar BadGatewayException quando a API responde com erro', async () => {
		client.checkouts.create.mockResolvedValue({ success: false, error: 'invalid product' });

		await expect(service.createCheckout({ items: [{ id: 'prod_1', quantity: 1 }] })).rejects.toThrow(BadGatewayException);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/modules/abacate-pay/abacate-pay.service.spec.ts`
Expected: FAIL — `service.createCheckout is not a function`.

- [ ] **Step 3: Implement `createCheckout`**

In `src/modules/abacate-pay/abacate-pay.service.ts`, add `RESTPostCreateNewCheckoutBody` to the type-only import from `@abacatepay/types/v2` and add the method:

```typescript
import type {
	APIResponse,
	RESTPostChangeSubscriptionPlanBody,
	RESTPostCreateCustomerBody,
	RESTPostCreateNewCheckoutBody,
	RESTPostCreateProductBody,
	RESTPostCreateSubscriptionBody,
} from '@abacatepay/types/v2';
```

```typescript
	async createCheckout(body: RESTPostCreateNewCheckoutBody) {
		return unwrap(await this.client.checkouts.create(body));
	}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/modules/abacate-pay/abacate-pay.service.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Fix the stale "Constraint 3" comment**

In `create-subscription.use-case.ts`, replace:

```typescript
		// SDK type gap: `url` existe na resposta real da API (docs.abacatepay.com/pages/subscriptions/create)
		// mas não está declarado em @abacatepay/types@3.0.3 — ver Constraint 3 do plano.
```

with:

```typescript
		// SDK type gap: `url` existe na resposta real da API (docs.abacatepay.com/pages/subscriptions/create)
		// mas não está declarado em RESTPostCreateSubscriptionData/APISubscription (@abacatepay/types@3.0.3).
		// Gap específico dessa resposta — o checkout (APICheckout.url) já vem tipado certo, ver AbacatePayService.createCheckout.
```

- [ ] **Step 6: Run full existing subscriptions-related tests to confirm no regression**

Run: `npx jest src/modules/abacate-pay src/modules/subscriptions`
Expected: PASS, no failures (this module had 0 pre-existing tests to break).

- [ ] **Step 7: Commit**

```bash
git add src/modules/abacate-pay/abacate-pay.service.ts src/modules/abacate-pay/abacate-pay.service.spec.ts src/modules/subscriptions/use-cases/create-subscription/create-subscription.use-case.ts
git commit -m "feat(abacate-pay): add createCheckout wrapper for one-time Pix charges"
```

---

### Task 2: Annual plan checkout — use-case, controller, docs

**Files:**
- Create: `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.use-case.ts`
- Create: `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.use-case.spec.ts`
- Create: `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.controller.ts`
- Create: `src/modules/subscriptions/use-cases/create-annual-checkout/docs.ts`
- Modify: `src/modules/subscriptions/subscriptions.module.ts`

**Interfaces:**
- Consumes: `AbacatePayService.createCheckout` (Task 1), `GetExistingSubscriptionUseCase.execute` (exists), `GetExistingPlanUseCase.execute` (exists), `AbacatePayService.cancelSubscription` (exists).
- Produces: `CreateAnnualCheckoutUseCase.execute(organizationId: string): Promise<{ checkoutUrl: string }>` — consumed by the controller in this task and referenced (for the `@SkipSubscriptionGuard()` addition) in Task 6.

- [ ] **Step 1: Write the failing test**

```typescript
// src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.use-case.spec.ts
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import type { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import type { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import type { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';
import { CreateAnnualCheckoutUseCase } from './create-annual-checkout.use-case';

type MockRepository = Pick<SubscriptionsRepositoryInterface, 'save'>;
type MockGetExistingSubscriptionUseCase = Pick<GetExistingSubscriptionUseCase, 'execute'>;
type MockGetExistingPlanUseCase = Pick<GetExistingPlanUseCase, 'execute'>;
type MockAbacatePayService = Pick<AbacatePayService, 'createCheckout' | 'cancelSubscription'>;

const createSubscriptionFixture = (overrides: Partial<Subscription> = {}): Subscription =>
	({
		id: 'sub-1',
		organization_id: 'org-1',
		plan_id: 'plan-1',
		status: SubscriptionStatus.ACTIVE,
		abacate_customer_id: 'cust-1',
		abacate_subscription_id: 'abacate-sub-1',
		billing_cycle: BillingCycle.MONTHLY,
		...overrides,
	}) as Subscription;

describe('CreateAnnualCheckoutUseCase', () => {
	let subscriptionsRepository: jest.Mocked<MockRepository>;
	let getExistingSubscriptionUseCase: jest.Mocked<MockGetExistingSubscriptionUseCase>;
	let getExistingPlanUseCase: jest.Mocked<MockGetExistingPlanUseCase>;
	let abacatePayService: jest.Mocked<MockAbacatePayService>;
	let useCase: CreateAnnualCheckoutUseCase;

	beforeEach(() => {
		subscriptionsRepository = { save: jest.fn() };
		getExistingSubscriptionUseCase = { execute: jest.fn() };
		getExistingPlanUseCase = { execute: jest.fn() };
		abacatePayService = { createCheckout: jest.fn(), cancelSubscription: jest.fn() };

		useCase = new CreateAnnualCheckoutUseCase(
			subscriptionsRepository as unknown as SubscriptionsRepositoryInterface,
			getExistingSubscriptionUseCase as unknown as GetExistingSubscriptionUseCase,
			getExistingPlanUseCase as unknown as GetExistingPlanUseCase,
			abacatePayService as unknown as AbacatePayService,
		);
	});

	it('deve cancelar a subscription mensal existente e criar um checkout avulso Pix referenciando o produto anual', async () => {
		const subscription = createSubscriptionFixture();
		getExistingSubscriptionUseCase.execute.mockResolvedValue(subscription);
		getExistingPlanUseCase.execute.mockResolvedValue({ id: 'plan-1', abacate_annual_product_id: 'prod_annual_1' } as never);
		abacatePayService.createCheckout.mockResolvedValue({ url: 'https://pay.abacatepay.com/checkout_annual_1' } as never);

		const result = await useCase.execute('org-1');

		expect(abacatePayService.cancelSubscription).toHaveBeenCalledWith('abacate-sub-1');
		expect(abacatePayService.createCheckout).toHaveBeenCalledWith({
			items: [{ id: 'prod_annual_1', quantity: 1 }],
			methods: ['PIX'],
			frequency: 'ONE_TIME',
			customerId: 'cust-1',
			externalId: 'org-1',
		});
		expect(subscription.abacate_subscription_id).toBeNull();
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
		expect(result).toEqual({ checkoutUrl: 'https://pay.abacatepay.com/checkout_annual_1' });
	});

	it('não deve chamar cancelSubscription quando não há assinatura recorrente ativa na AbacatePay', async () => {
		const subscription = createSubscriptionFixture({ abacate_subscription_id: null });
		getExistingSubscriptionUseCase.execute.mockResolvedValue(subscription);
		getExistingPlanUseCase.execute.mockResolvedValue({ id: 'plan-1', abacate_annual_product_id: 'prod_annual_1' } as never);
		abacatePayService.createCheckout.mockResolvedValue({ url: 'https://pay.abacatepay.com/checkout_annual_1' } as never);

		await useCase.execute('org-1');

		expect(abacatePayService.cancelSubscription).not.toHaveBeenCalled();
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/modules/subscriptions/use-cases/create-annual-checkout`
Expected: FAIL — cannot find module `./create-annual-checkout.use-case`.

- [ ] **Step 3: Implement the use-case**

```typescript
// src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { AbacatePayService } from '@/modules/abacate-pay/abacate-pay.service';
import { GetExistingPlanUseCase } from '@/modules/plans/use-cases/get-existing-plan/get-existing-plan.use-case';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingSubscriptionUseCase } from '../get-existing-subscription/get-existing-subscription.use-case';

@Injectable()
export class CreateAnnualCheckoutUseCase {
	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(GetExistingSubscriptionUseCase)
		private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
		@Inject(GetExistingPlanUseCase)
		private readonly getExistingPlanUseCase: GetExistingPlanUseCase,
		@Inject(AbacatePayService)
		private readonly abacatePayService: AbacatePayService,
	) {}

	async execute(organizationId: string): Promise<{ checkoutUrl: string }> {
		const subscription = await this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });
		const plan = await this.getExistingPlanUseCase.execute({ where: { id: subscription.plan_id } });

		// Se existe uma assinatura recorrente de cartão ativa, cancela antes de vender o anual —
		// senão o cliente fica sendo cobrado nos dois ao mesmo tempo.
		if (subscription.abacate_subscription_id) {
			await this.abacatePayService.cancelSubscription(subscription.abacate_subscription_id);
			subscription.abacate_subscription_id = null;
		}

		const checkout = await this.abacatePayService.createCheckout({
			items: [{ id: plan.abacate_annual_product_id, quantity: 1 }],
			methods: ['PIX'],
			frequency: 'ONE_TIME',
			customerId: subscription.abacate_customer_id ?? undefined,
			externalId: organizationId,
		});

		await this.subscriptionsRepository.save(subscription);

		return { checkoutUrl: checkout.url };
	}
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/modules/subscriptions/use-cases/create-annual-checkout`
Expected: PASS (2 tests).

- [ ] **Step 5: Add the controller**

```typescript
// src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.controller.ts
import { Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { Roles } from '@/modules/auth/shared/decorators/roles.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { CreateAnnualCheckoutUseCase } from './create-annual-checkout.use-case';
import { CreateAnnualCheckoutDocs } from './docs';

@ApiTags('Subscriptions')
@ApiCookieAuth()
@Controller('organizations/subscription/annual-checkout')
export class CreateAnnualCheckoutController {
	constructor(
		@Inject(CreateAnnualCheckoutUseCase)
		private readonly createAnnualCheckoutUseCase: CreateAnnualCheckoutUseCase,
	) {}

	@TenantScoped()
	@Roles(OrganizationRole.OWNER)
	@Post()
	@HttpCode(HttpStatus.OK)
	@CreateAnnualCheckoutDocs()
	async execute(@ActiveOrganizationId() organizationId: string): Promise<{ checkoutUrl: string }> {
		return this.createAnnualCheckoutUseCase.execute(organizationId);
	}
}
```

`@SkipSubscriptionGuard()` is intentionally NOT added here yet — that decorator doesn't exist until Task 6, which adds it to this controller along with the other 3 subscription-management controllers.

- [ ] **Step 6: Add the docs decorator**

```typescript
// src/modules/subscriptions/use-cases/create-annual-checkout/docs.ts
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CreateAnnualCheckoutDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Start an annual-plan Pix checkout',
			description:
				'Owner-only. Cancels any active monthly card subscription, then creates a one-time Pix checkout for the plan\'s annual price. ' +
				'The subscription is only marked ANNUAL/ACTIVE once the `checkout.completed` webhook confirms payment — this endpoint only returns the checkout URL.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Checkout created; the owner must complete the Pix payment at checkoutUrl.',
			schema: {
				type: 'object',
				properties: {
					checkoutUrl: { type: 'string' },
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.FORBIDDEN,
			description: 'Only the organization owner can start an annual checkout.',
		}),
	);
}
```

- [ ] **Step 7: Wire into the module**

In `src/modules/subscriptions/subscriptions.module.ts`, add imports and register in `controllers`/`providers`:

```typescript
import { CreateAnnualCheckoutController } from './use-cases/create-annual-checkout/create-annual-checkout.controller';
import { CreateAnnualCheckoutUseCase } from './use-cases/create-annual-checkout/create-annual-checkout.use-case';
```

```typescript
	controllers: [GetOrganizationSubscriptionController, ChangeSubscriptionPlanController, CancelSubscriptionController, CreateAnnualCheckoutController, AbacatePayWebhookController],
	providers: [
		// ...existing entries...
		CreateAnnualCheckoutUseCase,
	],
```

- [ ] **Step 8: Run tests to confirm the module still boots correctly**

Run: `npx jest src/modules/subscriptions`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/modules/subscriptions/use-cases/create-annual-checkout src/modules/subscriptions/subscriptions.module.ts
git commit -m "feat(subscriptions): add annual plan Pix checkout endpoint"
```

---

### Task 3: Webhook — handle `checkout.completed`

**Files:**
- Modify: `src/modules/subscriptions/use-cases/handle-abacate-pay-webhook/handle-abacate-pay-webhook.use-case.ts`
- Create: `src/modules/subscriptions/use-cases/handle-abacate-pay-webhook/handle-abacate-pay-webhook.use-case.spec.ts` (no spec exists today)
- Modify: `src/modules/subscriptions/use-cases/handle-abacate-pay-webhook/abacate-pay-webhook.controller.ts`

**Interfaces:**
- Consumes: `isCheckoutCompletedWebhookEvent`, `WebhookEvent`, `WebhookCheckoutCompletedEvent` from `@abacatepay/types/v2`.
- Produces: no new public interface — `HandleAbacatePayWebhookUseCase.execute` keeps its existing signature shape, just widens the accepted type to `WebhookEvent`.

- [ ] **Step 1: Write the failing tests**

```typescript
// src/modules/subscriptions/use-cases/handle-abacate-pay-webhook/handle-abacate-pay-webhook.use-case.spec.ts
import { WebhookEventType } from '@abacatepay/types/v2';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import type { AbacatePayWebhookEventsRepositoryInterface, SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import type { Subscription } from '../../models/entities/subscription.entity';
import { HandleAbacatePayWebhookUseCase } from './handle-abacate-pay-webhook.use-case';

type MockSubscriptionsRepository = Pick<SubscriptionsRepositoryInterface, 'findOne' | 'save'>;
type MockWebhookEventsRepository = Pick<AbacatePayWebhookEventsRepositoryInterface, 'insert'>;

describe('HandleAbacatePayWebhookUseCase', () => {
	let subscriptionsRepository: jest.Mocked<MockSubscriptionsRepository>;
	let webhookEventsRepository: jest.Mocked<MockWebhookEventsRepository>;
	let useCase: HandleAbacatePayWebhookUseCase;

	beforeEach(() => {
		subscriptionsRepository = { findOne: jest.fn(), save: jest.fn() };
		webhookEventsRepository = { insert: jest.fn().mockResolvedValue(undefined) };
		useCase = new HandleAbacatePayWebhookUseCase(
			subscriptionsRepository as unknown as SubscriptionsRepositoryInterface,
			webhookEventsRepository as unknown as AbacatePayWebhookEventsRepositoryInterface,
		);
	});

	it('deve ativar a assinatura em subscription.renewed e atualizar current_period_end', async () => {
		const subscription = { id: 'sub-1', status: SubscriptionStatus.PAST_DUE } as Subscription;
		subscriptionsRepository.findOne.mockResolvedValue(subscription);

		await useCase.execute({
			id: 'evt-1',
			event: WebhookEventType.SubscriptionRenewed,
			devMode: false,
			data: { subscription: { id: 'abacate-sub-1', currentPeriodEnd: '2027-01-01T00:00:00.000Z' } },
		} as never);

		expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
		expect(subscription.current_period_end).toEqual(new Date('2027-01-01T00:00:00.000Z'));
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
	});

	it('deve ativar a assinatura anual em checkout.completed, marcar billing_cycle ANNUAL e setar current_period_end +365 dias', async () => {
		const subscription = {
			id: 'sub-1',
			status: SubscriptionStatus.PAST_DUE,
			billing_cycle: BillingCycle.MONTHLY,
			last_renewal_reminder_days_before: 15,
		} as Subscription;
		subscriptionsRepository.findOne.mockResolvedValue(subscription);

		await useCase.execute({
			id: 'evt-2',
			event: WebhookEventType.CheckoutCompleted,
			devMode: false,
			data: {
				payment: { amount: 39900, fee: 80, method: 'PIX' },
				billing: { amount: 39900, id: 'checkout_1', externalId: 'org-1', status: 'PAID', url: 'https://pay.abacatepay.com/checkout_1' },
			},
		} as never);

		expect(subscriptionsRepository.findOne).toHaveBeenCalledWith({ where: { organization_id: 'org-1' } });
		expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
		expect(subscription.billing_cycle).toBe(BillingCycle.ANNUAL);
		expect(subscription.last_renewal_reminder_days_before).toBeNull();
		expect(subscription.current_period_end?.getTime()).toBeGreaterThan(Date.now() + 360 * 24 * 60 * 60 * 1000);
		expect(subscriptionsRepository.save).toHaveBeenCalledWith(subscription);
	});

	it('não deve quebrar quando checkout.completed referencia uma organização sem subscription local', async () => {
		subscriptionsRepository.findOne.mockResolvedValue(null);

		await useCase.execute({
			id: 'evt-3',
			event: WebhookEventType.CheckoutCompleted,
			devMode: false,
			data: {
				payment: { amount: 39900, fee: 80, method: 'PIX' },
				billing: { amount: 39900, id: 'checkout_2', externalId: 'org-unknown', status: 'PAID', url: 'https://pay.abacatepay.com/checkout_2' },
			},
		} as never);

		expect(subscriptionsRepository.save).not.toHaveBeenCalled();
	});

	it('deve pular o processamento quando o evento já foi registrado antes (idempotência)', async () => {
		const uniqueViolation = new Error('duplicate key') as Error & { code: string };
		uniqueViolation.code = '23505';
		Object.setPrototypeOf(uniqueViolation, (await import('typeorm')).QueryFailedError.prototype);
		webhookEventsRepository.insert.mockRejectedValue(uniqueViolation);

		await useCase.execute({
			id: 'evt-1',
			event: WebhookEventType.SubscriptionRenewed,
			devMode: false,
			data: { subscription: { id: 'abacate-sub-1' } },
		} as never);

		expect(subscriptionsRepository.findOne).not.toHaveBeenCalled();
	});
});
```

- [ ] **Step 2: Run tests to verify they fail (or pass for the pre-existing case, fail for the new ones)**

Run: `npx jest src/modules/subscriptions/use-cases/handle-abacate-pay-webhook`
Expected: the `subscription.renewed` and idempotency tests PASS against current code; the two `checkout.completed` tests FAIL (status stays whatever the mock started with, `billing_cycle` never touched).

- [ ] **Step 3: Implement `checkout.completed` handling**

Replace the full contents of `handle-abacate-pay-webhook.use-case.ts`:

```typescript
import type { WebhookCheckoutCompletedEvent, WebhookEvent } from '@abacatepay/types/v2';
import { isCheckoutCompletedWebhookEvent } from '@abacatepay/types/v2';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import type { AbacatePayWebhookEventsRepositoryInterface, SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY, SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

const POSTGRES_UNIQUE_VIOLATION = '23505';
const ANNUAL_PERIOD_DAYS = 365;

// subscription.* não tem payload tipado de verdade em @abacatepay/types@3.0.3 (cai em WebhookUndocumentedEvent,
// data: Record<string, unknown>) — mantemos essa forma mínima manual só pra esses eventos específicos.
interface SubscriptionEventData {
	id?: string;
	subscription?: { id: string; currentPeriodEnd?: string };
}

@Injectable()
export class HandleAbacatePayWebhookUseCase {
	private readonly logger = new Logger(HandleAbacatePayWebhookUseCase.name);

	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(ABACATE_PAY_WEBHOOK_EVENT_REPOSITORY_INTERFACE_KEY)
		private readonly webhookEventsRepository: AbacatePayWebhookEventsRepositoryInterface,
	) {}

	async execute(event: WebhookEvent): Promise<void> {
		const alreadyProcessed = await this.registerEvent(event);
		if (alreadyProcessed) {
			this.logger.log(`Webhook event ${event.id} (${event.event}) already processed, skipping`);
			return;
		}

		if (isCheckoutCompletedWebhookEvent(event)) {
			await this.handleCheckoutCompleted(event);
			return;
		}

		await this.handleSubscriptionEvent(event);
	}

	// O checkout avulso do plano anual dispara esse evento (não subscription.*) — não existe
	// subscription recorrente da AbacatePay pro anual, então o lookup é por externalId (= organizationId),
	// setado na criação do checkout em CreateAnnualCheckoutUseCase.
	private async handleCheckoutCompleted(event: WebhookCheckoutCompletedEvent): Promise<void> {
		const organizationId = event.data.billing.externalId;
		const subscription = await this.subscriptionsRepository.findOne({ where: { organization_id: organizationId } });
		if (!subscription) {
			this.logger.warn(`No local subscription for organization ${organizationId} (checkout ${event.data.billing.id})`);
			return;
		}

		const currentPeriodEnd = new Date();
		currentPeriodEnd.setDate(currentPeriodEnd.getDate() + ANNUAL_PERIOD_DAYS);

		subscription.billing_cycle = BillingCycle.ANNUAL;
		subscription.status = SubscriptionStatus.ACTIVE;
		subscription.current_period_end = currentPeriodEnd;
		subscription.last_renewal_reminder_days_before = null;
		await this.subscriptionsRepository.save(subscription);
	}

	private async handleSubscriptionEvent(event: WebhookEvent): Promise<void> {
		const data = event.data as SubscriptionEventData;
		const abacateSubscriptionId = data.subscription?.id ?? data.id;
		if (!abacateSubscriptionId) {
			this.logger.warn(`Webhook event without subscription id: ${event.event}`);
			return;
		}

		const subscription = await this.subscriptionsRepository.findOne({ where: { abacate_subscription_id: abacateSubscriptionId } });
		if (!subscription) {
			this.logger.warn(`No local subscription for AbacatePay subscription ${abacateSubscriptionId}`);
			return;
		}

		switch (event.event) {
			case 'subscription.renewed':
			case 'subscription.completed':
				subscription.status = SubscriptionStatus.ACTIVE;
				if (data.subscription?.currentPeriodEnd) {
					subscription.current_period_end = new Date(data.subscription.currentPeriodEnd);
				}
				break;
			case 'subscription.cancelled':
				if (subscription.status !== SubscriptionStatus.CANCELED) {
					subscription.status = SubscriptionStatus.CANCELED;
					subscription.canceled_at = new Date();
				}
				break;
			default:
				this.logger.log(`Unhandled webhook event: ${event.event}`);
				return;
		}

		await this.subscriptionsRepository.save(subscription);
	}

	/**
	 * Insere o evento antes de processar — se já existir (retry de entrega da AbacatePay),
	 * a constraint única em `event_id` rejeita o insert e sinaliza "já processado".
	 */
	private async registerEvent(event: WebhookEvent): Promise<boolean> {
		try {
			await this.webhookEventsRepository.insert({ event_id: event.id, event_type: event.event });
			return false;
		} catch (error) {
			if (error instanceof QueryFailedError && (error as unknown as { code?: string }).code === POSTGRES_UNIQUE_VIOLATION) {
				return true;
			}
			throw error;
		}
	}
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/modules/subscriptions/use-cases/handle-abacate-pay-webhook`
Expected: PASS (4 tests).

- [ ] **Step 5: Type the controller's payload**

In `abacate-pay-webhook.controller.ts`, import the type and use it:

```typescript
import type { WebhookEvent } from '@abacatepay/types/v2';
```

```typescript
		await this.handleAbacatePayWebhookUseCase.execute(request.body as WebhookEvent);
```

- [ ] **Step 6: Commit**

```bash
git add src/modules/subscriptions/use-cases/handle-abacate-pay-webhook
git commit -m "feat(subscriptions): handle checkout.completed webhook for annual Pix plan"
```

---

### Task 4: Expiration cron — per-cycle grace window

**Files:**
- Modify: `src/modules/subscriptions/use-cases/expire-stale-subscriptions/expire-stale-subscriptions.use-case.ts`
- Create: `src/modules/subscriptions/use-cases/expire-stale-subscriptions/expire-stale-subscriptions.use-case.spec.ts` (no spec exists today)

**Interfaces:**
- No change to the class's public shape (`execute(): Promise<void>`, still `@Cron(CronExpression.EVERY_DAY_AT_3AM)`).

- [ ] **Step 1: Write the failing test**

```typescript
// src/modules/subscriptions/use-cases/expire-stale-subscriptions/expire-stale-subscriptions.use-case.spec.ts
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ExpireStaleSubscriptionsUseCase } from './expire-stale-subscriptions.use-case';

type MockRepository = Pick<SubscriptionsRepositoryInterface, 'update'>;

describe('ExpireStaleSubscriptionsUseCase', () => {
	let repository: jest.Mocked<MockRepository>;
	let useCase: ExpireStaleSubscriptionsUseCase;

	beforeEach(() => {
		repository = { update: jest.fn().mockResolvedValue({ affected: 0, raw: [], generatedMaps: [] }) };
		useCase = new ExpireStaleSubscriptionsUseCase(repository as unknown as SubscriptionsRepositoryInterface);
	});

	it('deve marcar ACTIVE vencido como PAST_DUE independente do ciclo', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledWith(
			expect.objectContaining({ status: SubscriptionStatus.ACTIVE }),
			{ status: SubscriptionStatus.PAST_DUE },
		);
	});

	it('deve usar janela de 9 dias pra expirar assinaturas PAST_DUE do ciclo MONTHLY', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledWith(
			expect.objectContaining({ status: SubscriptionStatus.PAST_DUE, billing_cycle: BillingCycle.MONTHLY }),
			{ status: SubscriptionStatus.EXPIRED },
		);
	});

	it('deve usar janela de 5 dias (mais curta) pra expirar assinaturas PAST_DUE do ciclo ANNUAL', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledWith(
			expect.objectContaining({ status: SubscriptionStatus.PAST_DUE, billing_cycle: BillingCycle.ANNUAL }),
			{ status: SubscriptionStatus.EXPIRED },
		);
	});

	it('deve chamar update 3 vezes no total (1 PAST_DUE geral + 1 EXPIRED por ciclo)', async () => {
		await useCase.execute();

		expect(repository.update).toHaveBeenCalledTimes(3);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx jest src/modules/subscriptions/use-cases/expire-stale-subscriptions`
Expected: FAIL on the "3 vezes" and "billing_cycle" assertions — today's code calls `update` only twice and never filters by `billing_cycle`.

- [ ] **Step 3: Implement the per-cycle split**

Replace the full contents of `expire-stale-subscriptions.use-case.ts`:

```typescript
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

// AbacatePay não avisa cobrança falha por webhook — só `subscription.renewed` (sucesso) ou
// `subscription.cancelled` (terminal). PAST_DUE/EXPIRED só existem via essa varredura.
//
// MONTHLY (cartão): a AbacatePay tenta recobrar via retryPolicy (maxRetry: 3, retryEvery: 3 dias,
// configurado em create-subscription.use-case) antes de desistir — daí os 9 dias.
// ANNUAL (Pix avulso): não existe retry, é pagamento manual único — a carência é decisão de negócio
// pura, só pra dar folga caso o dono demore a perceber/pagar antes do bloqueio de acesso.
const EXPIRE_AFTER_PAST_DUE_DAYS: Record<BillingCycle, number> = {
	[BillingCycle.MONTHLY]: 9,
	[BillingCycle.ANNUAL]: 5,
};

@Injectable()
export class ExpireStaleSubscriptionsUseCase {
	private readonly logger = new Logger(ExpireStaleSubscriptionsUseCase.name);

	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_3AM)
	async execute(): Promise<void> {
		const now = new Date();

		const markedPastDue = await this.subscriptionsRepository.update(
			{ status: SubscriptionStatus.ACTIVE, current_period_end: LessThan(now) },
			{ status: SubscriptionStatus.PAST_DUE },
		);
		if (markedPastDue.affected) {
			this.logger.log(`Marked ${markedPastDue.affected} subscription(s) as PAST_DUE`);
		}

		for (const cycle of [BillingCycle.MONTHLY, BillingCycle.ANNUAL] as const) {
			const expireThreshold = new Date(now.getTime() - EXPIRE_AFTER_PAST_DUE_DAYS[cycle] * 24 * 60 * 60 * 1000);
			const markedExpired = await this.subscriptionsRepository.update(
				{ status: SubscriptionStatus.PAST_DUE, billing_cycle: cycle, current_period_end: LessThan(expireThreshold) },
				{ status: SubscriptionStatus.EXPIRED },
			);
			if (markedExpired.affected) {
				this.logger.log(`Marked ${markedExpired.affected} ${cycle} subscription(s) as EXPIRED`);
			}
		}
	}
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx jest src/modules/subscriptions/use-cases/expire-stale-subscriptions`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/modules/subscriptions/use-cases/expire-stale-subscriptions
git commit -m "fix(subscriptions): give ANNUAL a shorter EXPIRED grace window than MONTHLY's card-retry-driven one"
```

---

### Task 5: Renewal reminder emails (ANNUAL only)

**Files:**
- Modify: `src/modules/subscriptions/models/entities/subscription.entity.ts`
- Create: `src/modules/subscriptions/use-cases/send-renewal-reminder-emails/send-renewal-reminder-emails.use-case.ts`
- Create: `src/modules/subscriptions/use-cases/send-renewal-reminder-emails/send-renewal-reminder-emails.use-case.spec.ts`
- Modify: `src/modules/subscriptions/subscriptions.module.ts`

**Interfaces:**
- Consumes: `SendEmailUseCase.execute({ to, subject, html }): Promise<void>` (exists, exported by `EmailModule`).
- Produces: `Subscription.last_renewal_reminder_days_before: number | null` — new column, no other task depends on it directly.

- [ ] **Step 1: Add the entity column**

In `subscription.entity.ts`, add after `current_period_end`:

```typescript
	// Menor threshold de lembrete já enviado (30/15/3) — evita reenviar o mesmo aviso todo dia
	// enquanto o cron roda. Resetado pra null sempre que a assinatura renova (ver handle-abacate-pay-webhook).
	@Column({ name: 'last_renewal_reminder_days_before', type: 'int', nullable: true })
	last_renewal_reminder_days_before: number | null;
```

- [ ] **Step 2: Write the failing test**

```typescript
// src/modules/subscriptions/use-cases/send-renewal-reminder-emails/send-renewal-reminder-emails.use-case.spec.ts
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
import type { SendEmailUseCase } from '@/modules/email/use-cases/send-email/send-email.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SendRenewalReminderEmailsUseCase } from './send-renewal-reminder-emails.use-case';

type MockRepository = Pick<SubscriptionsRepositoryInterface, 'find' | 'save'>;
type MockSendEmailUseCase = Pick<SendEmailUseCase, 'execute'>;

const daysFromNow = (days: number): Date => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const createSubscriptionFixture = (overrides: Partial<Subscription> = {}): Subscription =>
	({
		id: 'sub-1',
		status: SubscriptionStatus.ACTIVE,
		billing_cycle: BillingCycle.ANNUAL,
		current_period_end: daysFromNow(20),
		last_renewal_reminder_days_before: null,
		organization: { name: 'Barbearia do Zé', owner: { email: 'ze@example.com' } },
		plan: { name: 'Solo' },
		...overrides,
	}) as Subscription;

describe('SendRenewalReminderEmailsUseCase', () => {
	let repository: jest.Mocked<MockRepository>;
	let sendEmailUseCase: jest.Mocked<MockSendEmailUseCase>;
	let useCase: SendRenewalReminderEmailsUseCase;

	beforeEach(() => {
		repository = { find: jest.fn(), save: jest.fn() };
		sendEmailUseCase = { execute: jest.fn() };
		useCase = new SendRenewalReminderEmailsUseCase(
			repository as unknown as SubscriptionsRepositoryInterface,
			sendEmailUseCase as unknown as SendEmailUseCase,
		);
	});

	it('deve enviar o lembrete de 30 dias e gravar o threshold quando faltam 20 dias e nunca foi lembrado', async () => {
		const subscription = createSubscriptionFixture({ current_period_end: daysFromNow(20), last_renewal_reminder_days_before: null });
		repository.find.mockResolvedValue([subscription]);

		await useCase.execute();

		expect(sendEmailUseCase.execute).toHaveBeenCalledWith(expect.objectContaining({ to: 'ze@example.com' }));
		expect(subscription.last_renewal_reminder_days_before).toBe(30);
		expect(repository.save).toHaveBeenCalledWith(subscription);
	});

	it('deve avançar pro lembrete de 15 dias quando já tinha enviado o de 30 e agora faltam 10 dias', async () => {
		const subscription = createSubscriptionFixture({ current_period_end: daysFromNow(10), last_renewal_reminder_days_before: 30 });
		repository.find.mockResolvedValue([subscription]);

		await useCase.execute();

		expect(sendEmailUseCase.execute).toHaveBeenCalledTimes(1);
		expect(subscription.last_renewal_reminder_days_before).toBe(15);
	});

	it('não deve reenviar o mesmo lembrete no mesmo threshold', async () => {
		const subscription = createSubscriptionFixture({ current_period_end: daysFromNow(2), last_renewal_reminder_days_before: 3 });
		repository.find.mockResolvedValue([subscription]);

		await useCase.execute();

		expect(sendEmailUseCase.execute).not.toHaveBeenCalled();
		expect(repository.save).not.toHaveBeenCalled();
	});

	it('deve filtrar a query por status ACTIVE e billing_cycle ANNUAL', async () => {
		repository.find.mockResolvedValue([]);

		await useCase.execute();

		expect(repository.find).toHaveBeenCalledWith(
			expect.objectContaining({
				where: expect.objectContaining({ status: SubscriptionStatus.ACTIVE, billing_cycle: BillingCycle.ANNUAL }),
			}),
		);
	});
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx jest src/modules/subscriptions/use-cases/send-renewal-reminder-emails`
Expected: FAIL — cannot find module `./send-renewal-reminder-emails.use-case`.

- [ ] **Step 4: Implement the use-case**

```typescript
// src/modules/subscriptions/use-cases/send-renewal-reminder-emails/send-renewal-reminder-emails.use-case.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThanOrEqual } from 'typeorm';
import { SendEmailUseCase } from '@/modules/email/use-cases/send-email/send-email.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { SUBSCRIPTION_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';

// Ordem ascendente é essencial: pra N dias restantes, queremos o MENOR threshold que ainda cobre
// esse valor (ex: 10 dias restantes -> 15, não 30) — ver a lógica de `find` abaixo.
const REMINDER_THRESHOLDS_DAYS = [3, 15, 30] as const;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class SendRenewalReminderEmailsUseCase {
	private readonly logger = new Logger(SendRenewalReminderEmailsUseCase.name);

	constructor(
		@Inject(SUBSCRIPTION_REPOSITORY_INTERFACE_KEY)
		private readonly subscriptionsRepository: SubscriptionsRepositoryInterface,
		@Inject(SendEmailUseCase)
		private readonly sendEmailUseCase: SendEmailUseCase,
	) {}

	@Cron(CronExpression.EVERY_DAY_AT_8AM)
	async execute(): Promise<void> {
		const now = new Date();
		const farthestThreshold = Math.max(...REMINDER_THRESHOLDS_DAYS);
		const withinWindow = new Date(now.getTime() + farthestThreshold * MS_PER_DAY);

		const candidates = await this.subscriptionsRepository.find({
			where: { status: SubscriptionStatus.ACTIVE, billing_cycle: BillingCycle.ANNUAL, current_period_end: LessThanOrEqual(withinWindow) },
			relations: { organization: { owner: true }, plan: true },
		});

		for (const subscription of candidates) {
			await this.maybeSendReminder(subscription, now);
		}
	}

	private async maybeSendReminder(subscription: Subscription, now: Date): Promise<void> {
		if (!subscription.current_period_end) return;

		const daysRemaining = Math.ceil((subscription.current_period_end.getTime() - now.getTime()) / MS_PER_DAY);
		const dueThreshold = REMINDER_THRESHOLDS_DAYS.find((threshold) => daysRemaining <= threshold);
		if (dueThreshold === undefined) return;

		const alreadySentForThisOrTighter =
			subscription.last_renewal_reminder_days_before !== null && subscription.last_renewal_reminder_days_before <= dueThreshold;
		if (alreadySentForThisOrTighter) return;

		await this.sendEmailUseCase.execute({
			to: subscription.organization.owner.email,
			subject: `Sua assinatura anual do Quickly vence em ${daysRemaining} dia(s)`,
			html: this.buildReminderHtml(subscription.organization.name, subscription.plan.name, daysRemaining),
		});

		subscription.last_renewal_reminder_days_before = dueThreshold;
		await this.subscriptionsRepository.save(subscription);
		this.logger.log(`Sent ${dueThreshold}-day renewal reminder for subscription ${subscription.id}`);
	}

	private buildReminderHtml(organizationName: string, planName: string, daysRemaining: number): string {
		return `
			<!DOCTYPE html>
			<html lang="pt-BR">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Renovação do plano anual</title>
			</head>
			<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
				<div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
					<h1 style="color: #2c3e50; margin-top: 0;">Sua assinatura vence em ${daysRemaining} dia(s)</h1>
					<p>Olá! O plano <strong>${planName}</strong> de <strong>${organizationName}</strong> no Quickly vence em ${daysRemaining} dia(s).</p>
					<p>Renove agora para não perder acesso ao sistema.</p>
					<p style="font-size: 12px; color: #999; margin-bottom: 0;">Se você já renovou, pode ignorar este email.</p>
				</div>
			</body>
			</html>
		`;
	}
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest src/modules/subscriptions/use-cases/send-renewal-reminder-emails`
Expected: PASS (4 tests).

- [ ] **Step 6: Wire into the module**

In `subscriptions.module.ts`:

```typescript
import { SendRenewalReminderEmailsUseCase } from './use-cases/send-renewal-reminder-emails/send-renewal-reminder-emails.use-case';
```

Add `EmailModule` to `imports` (for `SendEmailUseCase`) and `SendRenewalReminderEmailsUseCase` to `providers`:

```typescript
	imports: [TypeOrmModule.forFeature([Subscription, AbacatePayWebhookEvent]), PlansModule, AbacatePayModule, EmailModule],
```

```typescript
		SendRenewalReminderEmailsUseCase,
```

- [ ] **Step 7: Run full subscriptions test suite**

Run: `npx jest src/modules/subscriptions`
Expected: PASS, all tests green.

- [ ] **Step 8: Commit**

```bash
git add src/modules/subscriptions
git commit -m "feat(subscriptions): send 30/15/3-day renewal reminder emails for annual plans"
```

---

### Task 6: `SubscriptionStatusGuard` — actually block access when billing lapses

**Files:**
- Create: `src/modules/auth/shared/decorators/skip-subscription-guard.decorator.ts`
- Create: `src/modules/auth/guards/subscription-status.guard.ts`
- Create: `src/modules/auth/guards/subscription-status.guard.spec.ts`
- Modify: `src/app.module.ts`
- Modify: `src/modules/subscriptions/use-cases/get-organization-subscription/get-organization-subscription.controller.ts`
- Modify: `src/modules/subscriptions/use-cases/change-subscription-plan/change-subscription-plan.controller.ts`
- Modify: `src/modules/subscriptions/use-cases/cancel-subscription/cancel-subscription.controller.ts`
- Modify: `src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.controller.ts`

**Interfaces:**
- Consumes: `GetExistingSubscriptionUseCase.execute` (exists, exported by `SubscriptionsModule`, already imported in `AppModule`).

- [ ] **Step 1: Add the skip decorator**

```typescript
// src/modules/auth/shared/decorators/skip-subscription-guard.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_SUBSCRIPTION_GUARD_SKIPPED_KEY = 'isSubscriptionGuardSkipped';
export const SkipSubscriptionGuard = () => SetMetadata(IS_SUBSCRIPTION_GUARD_SKIPPED_KEY, true);
```

- [ ] **Step 2: Write the failing test for the guard**

```typescript
// src/modules/auth/guards/subscription-status.guard.spec.ts
import type { ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { GetExistingSubscriptionUseCase } from '@/modules/subscriptions/use-cases/get-existing-subscription/get-existing-subscription.use-case';
import { SubscriptionStatus } from '@/modules/subscriptions/shared/enums/subscription-status.enum';
import { SubscriptionStatusGuard } from './subscription-status.guard';

type MockGetExistingSubscriptionUseCase = Pick<GetExistingSubscriptionUseCase, 'execute'>;

const createMockContext = (session: Record<string, unknown> | undefined): ExecutionContext =>
	({
		switchToHttp: () => ({
			getRequest: () => ({ session }),
		}),
		getHandler: () => jest.fn(),
		getClass: () => jest.fn(),
	}) as unknown as ExecutionContext;

describe('SubscriptionStatusGuard', () => {
	let guard: SubscriptionStatusGuard;
	let reflector: Reflector;
	let getExistingSubscriptionUseCase: jest.Mocked<MockGetExistingSubscriptionUseCase>;

	beforeEach(() => {
		reflector = new Reflector();
		getExistingSubscriptionUseCase = { execute: jest.fn() };
		guard = new SubscriptionStatusGuard(reflector, getExistingSubscriptionUseCase as unknown as GetExistingSubscriptionUseCase);
	});

	it('deve permitir acesso em rotas públicas', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);
		const context = createMockContext(undefined);

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso em rotas não tenant-scoped', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(false);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso em rotas marcadas com @SkipSubscriptionGuard', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(true);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
		expect(getExistingSubscriptionUseCase.execute).not.toHaveBeenCalled();
	});

	it('deve permitir acesso quando não existe subscription pra organização (fail-open)', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue(null);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso quando a subscription está ACTIVE', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.ACTIVE } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve permitir acesso quando a subscription está TRIALING', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.TRIALING } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).resolves.toBe(true);
	});

	it('deve bloquear com ForbiddenException quando a subscription está PAST_DUE', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.PAST_DUE } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
	});

	it('deve bloquear com ForbiddenException quando a subscription está EXPIRED', async () => {
		jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false).mockReturnValueOnce(true).mockReturnValueOnce(false);
		getExistingSubscriptionUseCase.execute.mockResolvedValue({ status: SubscriptionStatus.EXPIRED } as never);
		const context = createMockContext({ activeOrganizationId: 'org-1' });

		await expect(guard.canActivate(context)).rejects.toThrow(ForbiddenException);
	});
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx jest src/modules/auth/guards/subscription-status.guard`
Expected: FAIL — cannot find module `./subscription-status.guard`.

- [ ] **Step 4: Implement the guard**

```typescript
// src/modules/auth/guards/subscription-status.guard.ts
import { type CanActivate, type ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionStatus } from '@/modules/subscriptions/shared/enums/subscription-status.enum';
import { GetExistingSubscriptionUseCase } from '@/modules/subscriptions/use-cases/get-existing-subscription/get-existing-subscription.use-case';
import { IS_PUBLIC_KEY } from '../shared/decorators/public.decorator';
import { IS_SUBSCRIPTION_GUARD_SKIPPED_KEY } from '../shared/decorators/skip-subscription-guard.decorator';
import { IS_TENANT_SCOPED_KEY } from '../shared/decorators/tenant-scoped.decorator';

const ALLOWED_STATUSES = [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING];

@Injectable()
export class SubscriptionStatusGuard implements CanActivate {
	constructor(
		@Inject(Reflector) private readonly reflector: Reflector,
		@Inject(GetExistingSubscriptionUseCase) private readonly getExistingSubscriptionUseCase: GetExistingSubscriptionUseCase,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
		if (isPublic) return true;

		const isTenantScoped = this.reflector.getAllAndOverride<boolean>(IS_TENANT_SCOPED_KEY, [context.getHandler(), context.getClass()]);
		if (!isTenantScoped) return true;

		const isSkipped = this.reflector.getAllAndOverride<boolean>(IS_SUBSCRIPTION_GUARD_SKIPPED_KEY, [context.getHandler(), context.getClass()]);
		if (isSkipped) return true;

		const { session } = context.switchToHttp().getRequest();
		const organizationId = session?.activeOrganizationId;
		if (!organizationId) return true; // TenantGuard já cobre a ausência de contexto de organização

		const subscription = await this.getExistingSubscriptionUseCase.execute({ where: { organization_id: organizationId } });
		if (!subscription) return true; // fail-open — mesma filosofia do EnforcePlanLimitUseCase

		if (!ALLOWED_STATUSES.includes(subscription.status)) {
			throw new ForbiddenException({
				message: 'Assinatura inativa. Regularize o pagamento para continuar.',
				status: subscription.status,
			});
		}

		return true;
	}
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx jest src/modules/auth/guards/subscription-status.guard`
Expected: PASS (8 tests).

- [ ] **Step 6: Register the guard globally**

In `src/app.module.ts`, import it and add a 4th `APP_GUARD`:

```typescript
import { SubscriptionStatusGuard } from './modules/auth/guards/subscription-status.guard';
```

```typescript
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
		{
			provide: APP_GUARD,
			useClass: SubscriptionStatusGuard,
		},
```

- [ ] **Step 7: Exempt the 4 subscription-management endpoints**

In each of the 4 controller files, add the import and decorator right above `@TenantScoped()` (or on the same decorator stack):

`get-organization-subscription.controller.ts`:
```typescript
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
```
```typescript
	@TenantScoped()
	@SkipSubscriptionGuard()
	@Get()
```

`change-subscription-plan.controller.ts`:
```typescript
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
```
```typescript
	@TenantScoped()
	@SkipSubscriptionGuard()
	@Roles(OrganizationRole.OWNER)
	@Patch()
```

`cancel-subscription.controller.ts`:
```typescript
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
```
```typescript
	@TenantScoped()
	@SkipSubscriptionGuard()
	@Roles(OrganizationRole.OWNER)
	@Delete()
```

`create-annual-checkout.controller.ts` (created without this decorator in Task 2 — add it now):
```typescript
import { SkipSubscriptionGuard } from '@/modules/auth/shared/decorators/skip-subscription-guard.decorator';
```
```typescript
	@TenantScoped()
	@SkipSubscriptionGuard()
	@Roles(OrganizationRole.OWNER)
	@Post()
```

- [ ] **Step 8: Run the full test suite**

Run: `npx jest`
Expected: same pre-existing pass/fail split as before this plan (7 suites still failing only on the unrelated missing `ABACATE_PAY_WEBHOOK_SECRET_KEY` local `.env` var), plus all new tests from Tasks 1–6 passing.

- [ ] **Step 9: Commit**

```bash
git add src/modules/auth src/app.module.ts src/modules/subscriptions/use-cases/get-organization-subscription/get-organization-subscription.controller.ts src/modules/subscriptions/use-cases/change-subscription-plan/change-subscription-plan.controller.ts src/modules/subscriptions/use-cases/cancel-subscription/cancel-subscription.controller.ts src/modules/subscriptions/use-cases/create-annual-checkout/create-annual-checkout.controller.ts
git commit -m "feat(auth): add SubscriptionStatusGuard to actually enforce subscription.status on tenant routes"
```

---

### Task 7: Documentation sync

**Files:**
- Modify: `docs/ARCHITECTURE.md`

Per `.claude/rules/documentation-sync.md`, this is part of the same change, not a separate PR.

- [ ] **Step 1: Update the `subscriptions` section**

Replace the bullet list under `### subscriptions` to add the new endpoint and guard, and fix the now-false webhook coverage claim:

```markdown
Principais peças:
- `CreateSubscriptionUseCase` — chamado durante a criação da organização; cria o customer e a subscription na AbacatePay, guarda `trial_ends_at` (30 dias) e retorna a URL de checkout onde o dono cadastra o cartão.
- `EnforcePlanLimitUseCase` — use case reutilizável, injetado em `organization-members` e `organization-services`, que barra criação além do limite do plano ativo (`professionals`/`services`; sem gate de clientes). Limite `null` no plano (ex: `max_professionals` do `STUDIO`) sempre passa.
- `ChangeSubscriptionPlanUseCase` / `CancelSubscriptionUseCase` — endpoints `PATCH /organizations/subscription/plan` e `DELETE /organizations/subscription`, restritos a `OWNER`.
- `CreateAnnualCheckoutUseCase` — endpoint `POST /organizations/subscription/annual-checkout`, restrito a `OWNER`. Cancela a subscription recorrente de cartão (se houver) e cria um checkout avulso Pix (`frequency: ONE_TIME`, `methods: ['PIX']`) referenciando `Plan.abacate_annual_product_id`, com `externalId` = organizationId. Não marca a subscription como `ANNUAL`/`ACTIVE` sozinho — isso só acontece quando o webhook `checkout.completed` confirma o pagamento.
- Webhook (`POST /webhooks/abacate-pay`) — recebe eventos `subscription.renewed`/`completed`/`cancelled` (lookup por `abacate_subscription_id`) e `checkout.completed` (lookup por `externalId` = organizationId, usado só pelo checkout avulso anual) e atualiza o status local. Autenticado via HMAC-SHA256 no header `X-Webhook-Signature`. Idempotente: cada evento é inserido em `AbacatePayWebhookEvent` (unique em `event_id`) antes de processar — se o insert falhar por duplicata (retry de entrega), o evento é ignorado. Outros eventos AbacatePay (`checkout.refunded`/`disputed`/`lost`, `transparent.*`, `transfer.*`, `payout.*`) não se aplicam hoje.
- `ExpireStaleSubscriptionsUseCase` — cron diário (`@nestjs/schedule`, `EVERY_DAY_AT_3AM`) que cobre cobrança recorrente falha: **AbacatePay não avisa falha de cobrança por webhook**, só sucesso (`subscription.renewed`) ou cancelamento terminal (`subscription.cancelled`), e o Pix avulso do anual não tem retry nenhum. A varredura marca `ACTIVE` com `current_period_end` vencido como `PAST_DUE` (qualquer ciclo), depois `PAST_DUE` como `EXPIRED` após uma janela por ciclo: 9 dias pro `MONTHLY` (janela do `retryPolicy: {maxRetry: 3, retryEvery: 3}` da AbacatePay), 5 dias pro `ANNUAL` (carência de negócio, sem retry externo).
- `SendRenewalReminderEmailsUseCase` — cron diário (`EVERY_DAY_AT_8AM`) que envia email ao dono nos 30/15/3 dias antes do `current_period_end` de assinaturas `ANNUAL` ativas. Idempotente via `Subscription.last_renewal_reminder_days_before` (reseta pra `null` a cada renovação).
- `SubscriptionStatusGuard` (`src/modules/auth/guards`) — `APP_GUARD` global que bloqueia (403) qualquer rota `@TenantScoped()` quando `subscription.status` não é `ACTIVE`/`TRIALING`. Fail-open se a organização não tiver subscription (não deveria acontecer em produção). Os 4 endpoints do próprio módulo de billing (`GET/PATCH/DELETE /organizations/subscription`, `POST /organizations/subscription/annual-checkout`) usam `@SkipSubscriptionGuard()` — senão uma organização `PAST_DUE`/`EXPIRED` nunca conseguiria ver o problema nem pagar pra resolver.
```

- [ ] **Step 2: Update the "Enforcement de limite de plano" flow section**

No change needed to that section's text (already accurate from a prior change), but add a new subsection right after it:

```markdown
### Ciclo de vida da assinatura anual (Pix avulso)
```
POST /organizations/subscription/annual-checkout (OWNER)
  → cancela subscription recorrente de cartão, se houver
  → cria checkout avulso Pix (Plan.abacate_annual_product_id, ONE_TIME, methods: [PIX])
  ← { checkoutUrl }
webhook checkout.completed (externalId = organizationId)
  → subscription.billing_cycle = ANNUAL, status = ACTIVE, current_period_end = agora + 365 dias
cron diário (3AM): current_period_end vencido → PAST_DUE → (5 dias depois) EXPIRED
cron diário (8AM): 30/15/3 dias antes do vencimento → email de renovação pro dono
```
```

- [ ] **Step 3: Verify the doc renders sensibly**

Run: `cat docs/ARCHITECTURE.md | grep -A5 "SubscriptionStatusGuard"` — confirm the new text landed in the right section.

- [ ] **Step 4: Commit**

```bash
git add docs/ARCHITECTURE.md
git commit -m "docs: sync ARCHITECTURE.md with annual billing lifecycle and SubscriptionStatusGuard"
```
