export class NotFoundOrganizationInviteException extends Error {
	constructor(fields: string) {
		super(`Convite da organização não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationInviteException';
	}
}
