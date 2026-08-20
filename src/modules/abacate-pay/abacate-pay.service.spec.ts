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
