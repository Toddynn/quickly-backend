import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { PasswordReset } from '../models/entities/password-reset.entity';
import type { PasswordResetRepositoryInterface } from '../models/interfaces/password-reset-repository.interface';

@Injectable()
export class PasswordResetRepository extends Repository<PasswordReset> implements PasswordResetRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(PasswordReset, dataSource.createEntityManager());
	}
}

