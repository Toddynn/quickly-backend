export interface ReplaceUserProfilePictureMediaDto {
	organization_id: string;
	user_id: string;
	buffer: Buffer;
	mime_type: string;
	original_filename: string;
}
