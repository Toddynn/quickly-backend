import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ActiveOrganizationId } from '@/modules/auth/shared/decorators/active-organization-id.decorator';
import { TenantScoped } from '@/modules/auth/shared/decorators/tenant-scoped.decorator';
import { GetAvailableSlotsDto } from '../../models/dto/input/get-available-slots.dto';
import { GetAvailableSlotsDocs } from './docs';
import { GetAvailableSlotsUseCase, type Slot } from './get-available-slots.use-case';

@ApiTags('Appointments')
@ApiCookieAuth()
@TenantScoped()
@Controller('appointments/available-slots')
export class GetAvailableSlotsController {
	constructor(
		@Inject(GetAvailableSlotsUseCase)
		private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCase,
	) {}

	@Get()
	@GetAvailableSlotsDocs()
	async execute(@ActiveOrganizationId() organizationId: string, @Query() dto: GetAvailableSlotsDto): Promise<Slot[]> {
		return this.getAvailableSlotsUseCase.execute(organizationId, dto.professional_id, dto.organization_service_id, dto.date);
	}
}
