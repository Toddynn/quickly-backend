import type { Media } from '@/modules/media/models/entities/media.entity';
import type { ListMediaUseCase } from '@/modules/media/use-cases/list-media/list-media.use-case';
import type { Organization } from '@/modules/organizations/models/entities/organization.entity';
import type { GetExistingOrganizationUseCase } from '@/modules/organizations/use-cases/get-existing-organization/get-existing-organization.use-case';
import { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';
import type { User } from '../../models/entities/user.entity';
import type { GetExistingUserUseCase } from '../get-existing-user/get-existing-user.use-case';
import { GetCurrentUserUseCase } from './get-current-user.use-case';

describe('GetCurrentUserUseCase', () => {
	let getExistingUserUseCase: jest.Mocked<Pick<GetExistingUserUseCase, 'execute'>>;
	let listMediaUseCase: jest.Mocked<Pick<ListMediaUseCase, 'execute'>>;
	let getExistingOrganizationUseCase: jest.Mocked<Pick<GetExistingOrganizationUseCase, 'execute'>>;

	const user = { id: 'user-1', name: 'A', email: 'a@b.com' } as User;
	const currentOrganization = {
		id: 'org-1',
		slug: 'acme',
		name: 'Acme',
		owner_id: 'owner-1',
	} as Organization;
	const media = {
		id: 'm1',
		storage_key: 'k',
		owner_type: MediaOwnerType.USER_PROFILE,
	} as Media;

	beforeEach(() => {
		getExistingUserUseCase = { execute: jest.fn() };
		listMediaUseCase = { execute: jest.fn() };
		getExistingOrganizationUseCase = { execute: jest.fn() };
	});

	it('deve carregar usuário, organização ativa e mídias do tenant', async () => {
		getExistingUserUseCase.execute.mockResolvedValue(user);
		getExistingOrganizationUseCase.execute.mockResolvedValue(currentOrganization);
		listMediaUseCase.execute.mockResolvedValue([media]);

		const useCase = new GetCurrentUserUseCase(
			getExistingUserUseCase as unknown as GetExistingUserUseCase,
			listMediaUseCase as unknown as ListMediaUseCase,
			getExistingOrganizationUseCase as unknown as GetExistingOrganizationUseCase,
		);

		const result = await useCase.execute({ user_id: 'user-1', organization_id: 'org-1' });

		expect(getExistingUserUseCase.execute).toHaveBeenCalledWith({ where: { id: 'user-1' } });
		expect(getExistingOrganizationUseCase.execute).toHaveBeenCalledWith({ where: { id: 'org-1' } });
		expect(listMediaUseCase.execute).toHaveBeenCalledWith({
			where: { user_id: 'user-1', organization_id: 'org-1' },
			order: { created_at: 'DESC' },
		});
		expect(result).toBe(user);
		expect(result.medias).toEqual([media]);
		expect(result.currentOrganization).toBe(currentOrganization);
	});
});
