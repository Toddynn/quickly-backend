import type { Repository } from 'typeorm';
import type { EmailConfirmation } from '../entities/email-confirmation.entity';

export interface EmailConfirmationRepositoryInterface extends Repository<EmailConfirmation> {}

