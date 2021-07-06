import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  // @ApiProperty()
  @IsNotEmpty()
  phone: string;

  // @ApiProperty()
  @IsNotEmpty()
  password: string;
}
