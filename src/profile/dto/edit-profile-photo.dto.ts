import { OmitType } from '@nestjs/swagger';

import { CreateProfileDto } from './create-profile.dto';

export class EditProfileDto extends OmitType(CreateProfileDto, ['userId'] as const) {}
