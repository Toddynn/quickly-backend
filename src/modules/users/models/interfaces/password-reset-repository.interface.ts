import type { Repository } from 'typeorm';
import type { PasswordReset } from '../entities/password-reset.entity';

export interface PasswordResetRepositoryInterface extends Repository<PasswordReset> {}

