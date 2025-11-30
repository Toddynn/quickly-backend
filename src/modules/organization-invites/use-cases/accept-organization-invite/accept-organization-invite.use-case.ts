import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/create-organization-member/create-organization-member.use-case';
import { GetExistingOrganizationMemberUseCase } from '@/modules/organization-members/use-cases/get-existing-organization-member/get-existing-organization-member.use-case';
import { InvalidOrganizationInviteException } from '../../errors/invalid-organization-invite.error';
import type { OrganizationInvitesRepositoryInterface } from '../../models/interfaces/repository.interface';
import { INVITE_STATUS } from '../../shared/constants/invite-status';
import { ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY } from '../../shared/constants/repository-interface-key';
import { GetExistingOrganizationInviteUseCase } from '../get-existing-organization-invite/get-existing-organization-invite.use-case';

@Injectable()
export class AcceptOrganizationInviteUseCase {
	constructor(
		@Inject(ORGANIZATION_INVITE_REPOSITORY_INTERFACE_KEY)
		private readonly organizationInvitesRepository: OrganizationInvitesRepositoryInterface,
		@Inject(GetExistingOrganizationMemberUseCase)
		private readonly getExistingOrganizationMemberUseCase: GetExistingOrganizationMemberUseCase,
		@Inject(CreateOrganizationMemberUseCase)
		private readonly createOrganizationMemberUseCase: CreateOrganizationMemberUseCase,
		@Inject(GetExistingOrganizationInviteUseCase)
		private readonly getExistingOrganizationInviteUseCase: GetExistingOrganizationInviteUseCase,
	) {}

	async execute(id: string, userId: string): Promise<{ message: string }> {
		const invite = await this.getExistingOrganizationInviteUseCase.execute({
			where: { id },
			relations: ['organization'],
		});

		if (invite.status !== INVITE_STATUS.PENDING) {
			throw new InvalidOrganizationInviteException('Convite não está mais pendente.');
		}

		const expirationDate = new Date(invite.expiration_date);
		if (expirationDate < new Date()) {
			await this.organizationInvitesRepository.update(invite.id, { status: INVITE_STATUS.EXPIRED });
			throw new InvalidOrganizationInviteException('Convite expirado.');
		}

		await this.getExistingOrganizationMemberUseCase.execute(
			{
				where: {
					user_id: userId,
					organization_id: invite.organization_id,
					active: true,
				},
			},
			{ throwIfFound: true },
		);

		await this.createOrganizationMemberUseCase.execute({
			organization_id: invite.organization_id,
			user_id: userId,
		});

		await this.organizationInvitesRepository.update(invite.id, { status: INVITE_STATUS.ACCEPTED });

		return { message: 'Convite aceito com sucesso. Usuário vinculado à organização.' };
	}
}
