import { IsEmail, IsNotEmpty, IsString, ValidateIf } from "class-validator";


export class LoginUserDto {
  
  @ValidateIf(o => !o.username)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ValidateIf(o => !o.email)
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}