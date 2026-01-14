import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 🔹 Create a new user
  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'WOMAN',
      isVerified: false,
    });

    await this.userRepository.save(user);

    return { message: 'User registered successfully. Awaiting verification.' };
  }

  // 🔹 Get all users
  findAll() {
    return this.userRepository.find();
  }

  // 🔹 Get one user by ID
  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  // 🔹 Update user info
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return this.userRepository.save(user);
  }

  // 🔹 Remove a user
  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
