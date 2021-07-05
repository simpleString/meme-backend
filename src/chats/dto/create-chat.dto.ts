import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateChatDto {
  // readonly firstUserId: number;
  // readonly secondUserId: number;
  // readonly users: [string, string];
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly user: string;
}
