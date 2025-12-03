import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailUseCase } from '@/modules/email/use-cases/send-email/send-email.use-case';
import { GetExistingOrganizationUseCase } from '@/modules/organizations/use-cases/get-existing-organization/get-existing-organization.use-case';
import type { SendOrganizationInviteEmailDto } from '../../models/dto/input/send-organization-invite-email.dto';

@Injectable()
export class SendOrganizationInviteEmailUseCase {
	constructor(
		@Inject(SendEmailUseCase)
		private readonly sendEmailUseCase: SendEmailUseCase,
		@Inject(ConfigService)
		private readonly configService: ConfigService,
		@Inject(GetExistingOrganizationUseCase)
		private readonly getExistingOrganizationUseCase: GetExistingOrganizationUseCase,
	) {}

	async execute(data: SendOrganizationInviteEmailDto): Promise<void> {
		const frontendUrl = this.configService.get<string>('FRONT_END_URL') || 'http://localhost:5173';
		const inviteLink = `${frontendUrl}/invite/${data.inviteId}`;

		const organization = await this.getExistingOrganizationUseCase.execute({ where: { id: data.organizationId } });

		await this.sendEmailUseCase.execute({
			to: data.email,
			subject: `Convite para se juntar à organização ${organization.name}`,
			html: `
				<!DOCTYPE html>
				<html lang="pt-BR">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Convite para Organização</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
						<h1 style="color: #2c3e50; margin-top: 0;">Você foi convidado!</h1>
						<p>Você recebeu um convite para se juntar à organização <strong>${organization.name}</strong>.</p>
						<p>Clique no botão abaixo para aceitar o convite:</p>
						<div style="text-align: center; margin: 30px 0;">
							<a href="${inviteLink}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Aceitar Convite</a>
						</div>
						<p style="font-size: 12px; color: #666;">Ou copie e cole este link no seu navegador:</p>
						<p style="font-size: 12px; color: #666; word-break: break-all;">${inviteLink}</p>
						<hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
						<p style="font-size: 12px; color: #999; margin-bottom: 0;">Este convite expira em 7 dias.</p>
					</div>
				</body>
				</html>
			`,
		});
	}
}
