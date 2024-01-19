import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, IsOptional } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  }, {
    message: "Password should contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol"
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  username: string;
  @IsOptional()
  @IsString()
  avatar: string;
}