import type { SendEmailUseCase } from '@/modules/email/use-cases/send-email/send-email.use-case';
import type { Subscription } from '../../models/entities/subscription.entity';
import type { SubscriptionsRepositoryInterface } from '../../models/interfaces/repository.interface';
import { BillingCycle } from '../../shared/enums/billing-cycle.enum';
import { SubscriptionStatus } from '../../shared/enums/subscription-status.enum';
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
