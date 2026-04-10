import type { MediaOwnerType } from '@/shared/enums/media-owner-type.enum';

export interface CreateMediaDto {
	organization_id: string;
	owner_type: MediaOwnerType;
	owner_id: string;
	user_id?: string | null;
	organization_service_id?: string | null;
	buffer: Buffer;
	mime_type: string;
	original_filename: string;
	checksum?: string;
}
