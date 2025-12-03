import type { Repository } from 'typeorm';
import type { OrganizationAddress } from '../entities/organization-address.entity';

export interface OrganizationAddressesRepositoryInterface extends Repository<OrganizationAddress> {}
