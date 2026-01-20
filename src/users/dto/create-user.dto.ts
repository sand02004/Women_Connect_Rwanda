import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from '@/src/enum/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;


  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  isVerified?: boolean;
}
