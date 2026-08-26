import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Organization } from '../../models/entities/organization.entity';
import { GetOrganizationDocs } from './docs';
import { GetOrganizationUseCase } from './get-organization.use-case';

@ApiTags('Organizations')
@Controller('organizations')
export class GetOrganizationController {
	constructor(
		@Inject(GetOrganizationUseCase)
		private readonly getOrganizationUseCase: GetOrganizationUseCase,
	) {}

	// path-to-regexp@8 (usado pelo @nestjs/platform-express@11) removeu suporte a regex customizada em ':id(...)',
	// então um `@Get(':id')` solto aqui sempre casaria antes de rotas literais de um segmento só, tipo
	// `GET /organizations/subscription` ou `GET /organizations/working-hours` — o Postgres então recebia "subscription"
	// como um UUID e estourava 500. Esse endpoint não tem nenhum consumidor hoje (nem frontend, nem specs), então a
	// forma mais simples e permanente de evitar a colisão é usar um path de dois segmentos, igual ao padrão já usado
	// em `check-slug-availability/:slug` neste mesmo módulo.
	@Get('by-id/:id')
	@GetOrganizationDocs()
	async execute(@Param('id', ParseUUIDPipe) id: string): Promise<Organization> {
		return await this.getOrganizationUseCase.execute(id);
	}
}
