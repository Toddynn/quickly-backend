import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import { MissingOrganizationContextException } from '../../errors/missing-organization-context.error';

export const ActiveOrganizationId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
	const request = ctx.switchToHttp().getRequest();
	const organizationId = request.session?.activeOrganizationId;

	if (!organizationId) {
		throw new MissingOrganizationContextException();
	}

	return organizationId;
});
