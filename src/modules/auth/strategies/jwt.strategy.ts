import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { env } from '@/shared/constants/env-variables';
import type { OrganizationRole } from '@/shared/constants/organization-roles';

export interface JwtPayload {
	sub: string;
	email: string;
	active_organization_id: string | null;
	organization_role: OrganizationRole | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: env.JWT_SECRET,
		});
	}

	validate(payload: JwtPayload): JwtPayload {
		return payload;
	}
}
