import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class TwoFaCallbackDto {
  
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  secretCode: string;
}