import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

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
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class EmailDto {
  @IsEmail()
  email: string;
}
