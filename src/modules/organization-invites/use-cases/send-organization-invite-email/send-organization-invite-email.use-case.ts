import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailUseCase } from '@/modules/email/use-cases/send-email/send-email.use-case';

@Injectable()
export class SendOrganizationInviteEmailUseCase {
	constructor(
		@Inject(SendEmailUseCase)
		private readonly sendEmailUseCase: SendEmailUseCase,
		@Inject(ConfigService)
		private readonly configService: ConfigService,
	) {}

	async execute(data: { email: string; inviteId: string; organizationName: string }): Promise<void> {
		const frontendUrl = this.configService.get<string>('FRONT_END_URL') || 'http://localhost:5173';
		const inviteLink = `${frontendUrl}/invite/${data.inviteId}`;

		await this.sendEmailUseCase.execute({
			to: data.email,
			subject: `Convite para se juntar à organização ${data.organizationName}`,
			html: `
				<h1>Você foi convidado para se juntar à organização ${data.organizationName}</h1>
				<p>Clique no link abaixo para aceitar o convite:</p>
				<a href="${inviteLink}">${inviteLink}</a>
				<p>Este convite expira em 7 dias.</p>
			`,
		});
	}
}

