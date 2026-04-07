import { PartialType } from '@nestjs/swagger';
import { CreateEmailConfirmationDto } from './create-email-confirmation.dto';

export class UpdateEmailConfirmationDto extends PartialType(CreateEmailConfirmationDto) {}
