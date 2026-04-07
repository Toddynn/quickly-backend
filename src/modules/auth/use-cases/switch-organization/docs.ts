import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwitchOrganizationDto } from '../../models/dto/input/switch-organization.dto';
import { AuthTokensDto } from '../../models/dto/output/auth-tokens.dto';

export function SwitchOrganizationDocs() {
	return applyDecorators(
		ApiBearerAuth(),
		ApiOperation({
			summary: 'Switch active organization',
			description: 'Switches the active organization context for the authenticated user, returning new tokens with the updated context.',
		}),
		ApiBody({
			type: SwitchOrganizationDto,
			description: 'Target organization',
		}),
		ApiResponse({
			status: HttpStatus.OK,
			description: 'Organization switched successfully.',
			type: AuthTokensDto,
		}),
		ApiResponse({
			status: HttpStatus.FORBIDDEN,
			description: 'User is not an active member of the target organization.',
		}),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: 'User not authenticated.',
		}),
	);
}
