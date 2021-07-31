import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
