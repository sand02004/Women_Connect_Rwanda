import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 🔹 Create a new user
  async create(
    createUserDto: CreateUserDto,
    creatorRole: UserRole = UserRole.WOMAN,
  ) {
    const { name, email, password, role } = createUserDto;

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    // Only admin can assign roles other than WOMAN
    let finalRole: UserRole = UserRole.WOMAN;
    if (role && creatorRole === UserRole.ADMIN) {
      finalRole = role;
    } else if (role && creatorRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can assign roles');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      isVerified: false,
    });

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      this.logger.error('Error creating user', err.stack);
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  // 🔹 Find user by email
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  // 🔹 Get all users
  async findAll(options?: { skip?: number; take?: number }): Promise<User[]> {
    const findOptions: FindManyOptions<User> = {
      where: { deletedAt: IsNull() },
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    };
    return this.userRepository.find(findOptions);
  }

  // 🔹 Get one user by ID
  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  // 🔹 Update user info
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`Error updating user ${id}`, err.stack);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  // 🔹 Soft delete user
  async remove(id: string) {
    const user = await this.findOne(id);
    user.deletedAt = new Date();

    try {
      return await this.userRepository.save(user);
    } catch (err) {
      this.logger.error(`Error deleting user ${id}`, err.stack);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // 🔹 Verify email
  async verifyEmail(id: string) {
    const user = await this.findOne(id);
    if (user.isVerified) return user;

    user.isVerified = true;
    return this.userRepository.save(user);
  }
}
