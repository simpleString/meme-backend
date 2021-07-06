import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEmpty, IsInt, IsUUID } from 'class-validator';

export class MessageSearchDto {
  @ApiPropertyOptional()
  // @IsDateString()
  date?: Date;

  @ApiPropertyOptional()
  // @IsUUID()
  chatId?: string;

  @ApiPropertyOptional()
  // @IsUUID()
  messageId?: string;

  @ApiPropertyOptional()
  // @IsInt()
  limit?: number;
}
