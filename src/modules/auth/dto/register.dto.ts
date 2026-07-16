import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'julfiker Islam' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'julfiker@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '01741703755' })
  @IsNotEmpty()
  contact_number: string;
}

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class OtpDto extends EmailDto {
  @IsString()
  @Length(6, 6)
  otp: string;
}

export class NewPasswordDto {
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;

  @IsNotEmpty()
  token: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  current_password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;
}