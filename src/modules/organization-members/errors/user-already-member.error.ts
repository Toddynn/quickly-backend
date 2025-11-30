export class UserAlreadyMemberException extends Error {
	constructor(userId: string, organizationId: string) {
		super(`O usuário ${userId} já é membro da organização ${organizationId}`);
		this.name = 'UserAlreadyMemberException';
	}
}
