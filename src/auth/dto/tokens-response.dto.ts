import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  access_token: string;
}
