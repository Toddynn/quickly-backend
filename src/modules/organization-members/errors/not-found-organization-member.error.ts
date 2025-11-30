export class NotFoundOrganizationMemberException extends Error {
	constructor(fields: string) {
		super(`Membro da organização não encontrado com os critérios: ${fields}`);
		this.name = 'NotFoundOrganizationMemberException';
	}
}
