import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { MessageStatus } from '../entities/message.entity';
import { UpdateMessageDto } from './update-message.dto';

export class UpdateMessageStatusDto extends PartialType(UpdateMessageDto) {
  @IsNotEmpty()
  status: MessageStatus;
}
