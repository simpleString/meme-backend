import { IsInt, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ConfirmCodeDto {
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsInt()
  code: number;
}
