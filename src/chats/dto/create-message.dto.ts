import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  // @ApiProperty()
  // @IsNotEmpty()
  // @IsUUID()
  chatId: string;

  @ApiProperty()
  @IsNotEmpty()
  text: string;
}
