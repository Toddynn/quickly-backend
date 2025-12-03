import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestPasswordResetDto } from '../../models/dto/input/request-password-reset.dto';

export function RequestPasswordResetDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Request password recovery',
			description:
				'Sends a 6-digit OTP code to the provided email. The code expires in 15 minutes. For security reasons, the response is always the same, regardless of whether the email exists in the system or not.',
		}),
		ApiBody({
			type: RequestPasswordResetDto,
			description: 'User email for password recovery',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'If the email exists, an OTP code has been sent.',
			schema: {
				example: {
					message: 'Se o email existir, um código OTP foi enviado.',
				},
			},
		}),
		ApiResponse({
			status: HttpStatus.BAD_REQUEST,
			description: 'Invalid data for password recovery request.',
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Unexpected error while requesting password recovery.',
		}),
	);
}
