import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class updateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  present_address?: string;

  @IsOptional()
  @IsString()
  permanent_address?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  latitude?: string;
}
