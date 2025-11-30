export class NotFoundOrganizationException extends Error {
	constructor(fields: string) {
		super(`Organização não encontrada com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationException';
	}
}
