export function isAbacateSubscriptionId(id: string): boolean {
	return id.startsWith('subs_');
}

export function isAbacateCheckoutId(id: string): boolean {
	return id.startsWith('bill_');
}
