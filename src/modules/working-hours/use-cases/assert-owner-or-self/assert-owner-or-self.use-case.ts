import { Inject, Injectable } from '@nestjs/common';
import type { SessionUser } from '@/modules/auth/models/interfaces/session-user.interface';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import { OrganizationRole } from '@/shared/constants/organization-roles';
import { ForbiddenScheduleAccessException } from '../../errors/forbidden-schedule-access.error';

@Injectable()
export class AssertOwnerOrSelfUseCase {
	constructor(
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
	) {}

	async execute(professionalId: string, organizationId: string, currentUser: SessionUser): Promise<void> {
		if (currentUser.organizationRole === OrganizationRole.OWNER) return;

		const professional = await this.getExistingOrganizationMemberUseCase.execute({
			where: { id: professionalId, organization_id: organizationId },
		});

		if (professional.user_id !== currentUser.userId) {
			throw new ForbiddenScheduleAccessException();
		}
	}
}
