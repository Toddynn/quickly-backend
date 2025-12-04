import type { Repository } from 'typeorm';
import type { PaginatedResponseDto } from '@/shared/dto/pagination.dto';
import type { ListOrganizationAddressesDto } from '../dto/input/list-organization-addresses.dto';
import type { ListOrganizationAddressResponseDto } from '../dto/output/list-organization-address-response.dto';
import type { OrganizationAddress } from '../entities/organization-address.entity';

export interface OrganizationAddressesRepositoryInterface extends Repository<OrganizationAddress> {
	findAllPaginated(listDto: ListOrganizationAddressesDto): Promise<PaginatedResponseDto<ListOrganizationAddressResponseDto>>;
}
