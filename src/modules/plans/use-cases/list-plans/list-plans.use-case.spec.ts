import type { AppCacheService } from '@/shared/cache/app-cache.service';
import type { Plan } from '../../models/entities/plan.entity';
import type { PlansRepositoryInterface } from '../../models/interfaces/repository.interface';
import { ListPlansUseCase } from './list-plans.use-case';

type MockRepository = Pick<PlansRepositoryInterface, 'find'>;
type MockAppCacheService = Pick<AppCacheService, 'getOrSet'>;

describe('ListPlansUseCase', () => {
	let plansRepository: jest.Mocked<MockRepository>;
	let appCacheService: jest.Mocked<MockAppCacheService>;
	let useCase: ListPlansUseCase;

	beforeEach(() => {
		plansRepository = { find: jest.fn() };
		appCacheService = { getOrSet: jest.fn() };
		useCase = new ListPlansUseCase(plansRepository as unknown as PlansRepositoryInterface, appCacheService as unknown as AppCacheService);
	});

	it('deve buscar os planos via cache, com a chave e o TTL de plansList', async () => {
		const plans = [{ id: 'plan-1' } as Plan];
		appCacheService.getOrSet.mockImplementation(async (_key, _ttl, factory) => factory());
		plansRepository.find.mockResolvedValue(plans);

		const result = await useCase.execute();

		expect(appCacheService.getOrSet).toHaveBeenCalledWith('plans:list', 600, expect.any(Function));
		expect(plansRepository.find).toHaveBeenCalledWith({ where: { active: true }, order: { price_cents: 'ASC' } });
		expect(result).toEqual(plans);
	});

	it('não deve consultar o repositório quando a AppCacheService já retorna um valor cacheado', async () => {
		const cachedPlans = [{ id: 'plan-cached' } as Plan];
		appCacheService.getOrSet.mockResolvedValue(cachedPlans);

		const result = await useCase.execute();

		expect(plansRepository.find).not.toHaveBeenCalled();
		expect(result).toEqual(cachedPlans);
	});
});
