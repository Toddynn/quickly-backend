export interface UpdateMediaDto {
	id: string;
	organization_id: string;
	buffer: Buffer;
	mime_type: string;
	original_filename: string;
	checksum?: string;
}
