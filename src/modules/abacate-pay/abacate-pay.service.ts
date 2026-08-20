import type { AbacatePay as AbacatePayClient } from '@abacatepay/sdk';
import type {
	APIResponse,
	RESTPostChangeSubscriptionPlanBody,
	RESTPostCreateCustomerBody,
	RESTPostCreateNewCheckoutBody,
	RESTPostCreateProductBody,
	RESTPostCreateSubscriptionBody,
} from '@abacatepay/types/v2';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ABACATE_PAY_CLIENT } from './abacate-pay.constants';

function unwrap<Data>(response: APIResponse<Data>): Data {
	if (!response.success) {
		throw new BadGatewayException(`AbacatePay request failed: ${response.error}`);
	}
	return response.data;
}

@Injectable()
export class AbacatePayService {
	constructor(@Inject(ABACATE_PAY_CLIENT) private readonly client: ReturnType<typeof AbacatePayClient>) {}

	async createCustomer(body: RESTPostCreateCustomerBody) {
		return unwrap(await this.client.customers.create(body));
	}

	async createSubscription(body: RESTPostCreateSubscriptionBody) {
		return unwrap(await this.client.subscriptions.create(body));
	}

	async cancelSubscription(abacateSubscriptionId: string) {
		return unwrap(await this.client.subscriptions.cancel(abacateSubscriptionId));
	}

	async changePlan(abacateSubscriptionId: string, body: Omit<RESTPostChangeSubscriptionPlanBody, 'id'>) {
		return unwrap(await this.client.subscriptions.changePlan(abacateSubscriptionId, body));
	}

	async createProduct(body: RESTPostCreateProductBody) {
		return unwrap(await this.client.products.create(body));
	}

	async createCheckout(body: RESTPostCreateNewCheckoutBody) {
		return unwrap(await this.client.checkouts.create(body));
	}
}
