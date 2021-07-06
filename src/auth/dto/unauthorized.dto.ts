import { ApiProperty } from '@nestjs/swagger';

export class Unauthorized {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
}
