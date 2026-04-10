export enum MediaOwnerType {
	USER_PROFILE = 'user-profile',
	ORGANIZATION_LOGO = 'organization-logo',
	ORGANIZATION_SERVICE = 'organization-service',
}

export const MEDIA_OWNER_TYPE_USER_PROFILE_PARTIAL_UNIQUE_INDEX_WHERE = `("owner_type" = '${MediaOwnerType.USER_PROFILE}') AND ("user_id" IS NOT NULL)`;

export const MEDIA_OWNER_TYPE_ORGANIZATION_LOGO_PARTIAL_UNIQUE_INDEX_WHERE = `("owner_type" = '${MediaOwnerType.ORGANIZATION_LOGO}')`;
