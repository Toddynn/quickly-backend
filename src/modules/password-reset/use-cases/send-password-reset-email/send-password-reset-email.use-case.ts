import { Inject, Injectable } from '@nestjs/common';
import { SendEmailUseCase } from '@/modules/email/use-cases/send-email/send-email.use-case';
import type { SendPasswordResetEmailDto } from '../../models/dto/input/send-password-reset-email.dto';

@Injectable()
export class SendPasswordResetEmailUseCase {
	constructor(
		@Inject(SendEmailUseCase)
		private readonly sendEmailUseCase: SendEmailUseCase,
	) {}

	async execute(data: SendPasswordResetEmailDto): Promise<void> {
		await this.sendEmailUseCase.execute({
			to: data.email,
			subject: 'Código de recuperação de senha',
			html: `
				<!DOCTYPE html>
				<html lang="pt-BR">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Recuperação de Senha</title>
				</head>
				<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
					<div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
						<h1 style="color: #2c3e50; margin-top: 0;">Recuperação de Senha</h1>
						<p>Você solicitou a recuperação de senha. Use o código abaixo para continuar:</p>
						<div style="text-align: center; margin: 30px 0;">
							<div style="background-color: #3498db; color: white; padding: 20px; border-radius: 5px; display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 5px;">
								${data.otpCode}
							</div>
						</div>
						<p style="font-size: 12px; color: #666;">Este código expira em 15 minutos.</p>
						<p style="font-size: 12px; color: #999; margin-bottom: 0;">Se você não solicitou esta recuperação, ignore este email.</p>
					</div>
				</body>
				</html>
			`,
		});
	}
}

