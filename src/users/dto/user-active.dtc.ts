import { ApiProperty } from '@nestjs/swagger';

export class UserActiveDto {
  lastActive: Date;
}
