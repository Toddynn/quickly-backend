import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SessionUserDto } from '../../models/dto/output/session-user.dto';

export function RefreshSessionDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'Refresh session',
			description: 'Validates the current session and extends its TTL. Requires an active session cookie.',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Session refreshed successfully.',
			type: SessionUserDto,
		}),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: 'Invalid or expired session.',
		}),
	);
}
