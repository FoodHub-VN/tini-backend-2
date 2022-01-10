
import { IsEmail, IsNotEmpty, IsPhoneNumber, MaxLength, MinLength } from "class-validator";

export class EnterpriseRegisterDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8, { message: " The min length of password is 8 " })
  @MaxLength(20, { message: " The password can't accept more than 20 characters " })
  readonly password: string;

  @IsPhoneNumber()
  readonly phone: number;
}