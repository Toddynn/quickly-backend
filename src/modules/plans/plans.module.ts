import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Plan } from './models/entities/plan.entity';
import { PlansRepository } from './repository/plans.repository';
import { SeedPlansService } from './services/seed-plans.service';
import { PLAN_REPOSITORY_INTERFACE_KEY } from './shared/constants/repository-interface-key';
import { GetExistingPlanUseCase } from './use-cases/get-existing-plan/get-existing-plan.use-case';
import { ListPlansController } from './use-cases/list-plans/list-plans.controller';
import { ListPlansUseCase } from './use-cases/list-plans/list-plans.use-case';

@Module({
	imports: [TypeOrmModule.forFeature([Plan])],
	controllers: [ListPlansController],
	providers: [
		{
			provide: PLAN_REPOSITORY_INTERFACE_KEY,
			useFactory: (dataSource: DataSource) => new PlansRepository(dataSource),
			inject: [DataSource],
		},
		GetExistingPlanUseCase,
		ListPlansUseCase,
		SeedPlansService,
	],
	exports: [PLAN_REPOSITORY_INTERFACE_KEY, GetExistingPlanUseCase],
})
export class PlansModule {}
