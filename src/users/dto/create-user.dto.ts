import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
