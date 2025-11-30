import type { Repository } from 'typeorm';
import type { Organization } from '../entities/organization.entity';

export interface OrganizationsRepositoryInterface extends Repository<Organization> {}
