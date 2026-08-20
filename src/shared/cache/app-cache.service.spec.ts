import type { SessionConfigService } from '@/configs/session/session-config.service';
import { AppCacheService } from './app-cache.service';

type MockRedisClient = {
	get: jest.Mock;
	set: jest.Mock;
};

type MockSessionConfigService = Pick<SessionConfigService, 'getRedisClient'>;

describe('AppCacheService.getOrSet', () => {
	let redisClient: MockRedisClient;
	let sessionConfigService: jest.Mocked<MockSessionConfigService>;
	let service: AppCacheService;

	beforeEach(() => {
		redisClient = { get: jest.fn(), set: jest.fn() };
		sessionConfigService = { getRedisClient: jest.fn() };
		service = new AppCacheService(sessionConfigService as unknown as SessionConfigService);
	});

	it('deve chamar a factory direto quando o Redis está indisponível (fail-open)', async () => {
		sessionConfigService.getRedisClient.mockResolvedValue(null);
		const factory = jest.fn().mockResolvedValue({ value: 42 });

		const result = await service.getOrSet('some-key', 60, factory);

		expect(factory).toHaveBeenCalledTimes(1);
		expect(result).toEqual({ value: 42 });
	});

	it('deve retornar o valor cacheado sem chamar a factory quando já existe no Redis', async () => {
		redisClient.get.mockResolvedValue(JSON.stringify({ value: 42 }));
		sessionConfigService.getRedisClient.mockResolvedValue(redisClient as never);
		const factory = jest.fn();

		const result = await service.getOrSet('some-key', 60, factory);

		expect(redisClient.get).toHaveBeenCalledWith('quickly:cache:some-key');
		expect(factory).not.toHaveBeenCalled();
		expect(result).toEqual({ value: 42 });
	});

	it('deve chamar a factory e gravar no Redis com o TTL informado quando não há cache', async () => {
		redisClient.get.mockResolvedValue(null);
		sessionConfigService.getRedisClient.mockResolvedValue(redisClient as never);
		const factory = jest.fn().mockResolvedValue({ value: 42 });

		const result = await service.getOrSet('some-key', 60, factory);

		expect(factory).toHaveBeenCalledTimes(1);
		expect(redisClient.set).toHaveBeenCalledWith('quickly:cache:some-key', JSON.stringify({ value: 42 }), { EX: 60 });
		expect(result).toEqual({ value: 42 });
	});
});
