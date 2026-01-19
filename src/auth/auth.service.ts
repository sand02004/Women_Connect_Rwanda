import { Injectable, UnauthorizedException } from '@nestjs/common'; // Injectable & Exceptions
import { JwtService } from '@nestjs/jwt'; // JWT signing
import * as bcrypt from 'bcrypt'; // Password hashing
import { UsersService } from '../users/users.service'; // Users service
import { LoginDto } from './dto/login.dto'; // Login DTO
import { RegisterDto } from './dto/register.dto'; // Register DTO
import { BadRequestException } from '@nestjs/common'; // For registration checks
import { Role } from '../enum/role.enum'; // User roles

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 🔹 REGISTER a new user
  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersService.create({
      name,
      email,
      password: hashedPassword,
      role: Role.WOMAN,
      isVerified: false,
    });
     const loadtoken = { 
      name: name,
      email:email,
      role:Role,
      user:user.id
     }
    const token = this.jwtService.sign(loadtoken);

    return {
      message: 'User registered successfully. Awaiting verification.',
      token,
    };
  }

  // 🔹 LOGIN and return JWT
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    // if (!user.isVerified)
    //   throw new UnauthorizedException('Account not verified');

    const payload = { sub: user.id, email: user.email};
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token,
     
    };
  }
}
