import type { Repository } from 'typeorm';
import type { OrganizationService } from '../entities/organization-service.entity';

export interface OrganizationServicesRepositoryInterface extends Repository<OrganizationService> {}
