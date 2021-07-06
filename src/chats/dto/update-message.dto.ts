import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MessageStatus } from '../entities/message.entity';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {
  messageId: string;

  @ApiProperty({ nullable: true })
  @IsEnum(MessageStatus)
  status: MessageStatus;
}
