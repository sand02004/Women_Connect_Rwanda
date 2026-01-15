import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return { message: 'User registered' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return { message: 'Login successful' };
  }
}
