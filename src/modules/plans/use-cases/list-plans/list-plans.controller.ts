import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@/modules/auth/shared/decorators/public.decorator';
import { Plan } from '../../models/entities/plan.entity';
import { ListPlansDocs } from './docs';
import { ListPlansUseCase } from './list-plans.use-case';

@ApiTags('Plans')
@Controller('plans')
export class ListPlansController {
	constructor(
		@Inject(ListPlansUseCase)
		private readonly listPlansUseCase: ListPlansUseCase,
	) {}

	@Public()
	@Get()
	@ListPlansDocs()
	async execute(): Promise<Plan[]> {
		return this.listPlansUseCase.execute();
	}
}
