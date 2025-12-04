import { Injectable } from '@nestjs/common';
import { type DataSource, Repository } from 'typeorm';
import { EmailConfirmation } from '../models/entities/email-confirmation.entity';
import type { EmailConfirmationRepositoryInterface } from '../models/interfaces/email-confirmation-repository.interface';

@Injectable()
export class EmailConfirmationRepository extends Repository<EmailConfirmation> implements EmailConfirmationRepositoryInterface {
	constructor(dataSource: DataSource) {
		super(EmailConfirmation, dataSource.createEntityManager());
	}
}
