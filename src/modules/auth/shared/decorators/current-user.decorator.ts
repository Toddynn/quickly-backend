import { type ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { SessionUser } from '../../models/interfaces/session-user.interface';
import { getSessionUser } from '../helpers/session.helper';

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): SessionUser => {
	const request = ctx.switchToHttp().getRequest();
	return getSessionUser(request);
});
