import type { Repository } from 'typeorm';
import type { PaginatedResponseDto, PaginationDto } from '@/shared/dto/pagination.dto';
import type { User } from '../entities/user.entity';
import type { UserWithoutPassword } from './user-without-password.interface';

export interface UsersRepositoryInterface extends Repository<User> {
	listAllUsersPaginated(paginationDto: PaginationDto): Promise<PaginatedResponseDto<UserWithoutPassword>>;
}
