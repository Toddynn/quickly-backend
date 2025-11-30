export class ActiveInviteAlreadyExistsException extends Error {
	constructor(email: string, organizationId: string) {
		super(`Já existe um convite ativo para o email ${email} na organização ${organizationId}`);
		this.name = 'ActiveInviteAlreadyExistsException';
	}
}
