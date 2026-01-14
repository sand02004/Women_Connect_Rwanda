import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Sandrine Umugwaneza' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'sandrine@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Admin123!' })
  @MinLength(6)
  password: string;
}
