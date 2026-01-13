// src/users/dto/create-user.dto.ts
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  acceptedTerms: boolean;
}
