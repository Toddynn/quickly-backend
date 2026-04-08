import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from '../../models/dto/input/login.dto';
import { SessionUserDto } from '../../models/dto/output/session-user.dto';

export function LoginDocs() {
	return applyDecorators(
		ApiOperation({
			summary: 'User login',
			description:
				'Authenticates a user with email and password, creating a server-side session. Optional rememberMe extends idle timeout; absolute session lifetime is capped by SESSION_ABSOLUTE_MAX_SECONDS.',
		}),
		ApiBody({
			type: LoginDto,
			description: 'User credentials',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Login successful. Session cookie set.',
			type: SessionUserDto,
		}),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: 'Invalid credentials.',
		}),
	);
}
