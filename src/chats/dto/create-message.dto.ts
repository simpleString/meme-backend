import { ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @ApiHideProperty()
  chatId: string;

  @IsNotEmpty()
  text: string;
}
