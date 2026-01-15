import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UsersService } from '../users/users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly usersService: UsersService,
  ) {}

  // 🔹 Create profile (1 per user)
  async create(userId: string, dto: CreateProfileDto) {
    const user = await this.usersService.findOne(userId);

    const existingProfile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (existingProfile) {
      throw new BadRequestException('Profile already exists');
    }

    const profile = this.profileRepository.create({
      ...dto,
      user,
    });

    return this.profileRepository.save(profile);
  }

  // 🔹 Get my profile
  async findByUser(userId: string) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  // 🔹 Update profile (owner only)
  async update(profileId: string, userId: string, dto: UpdateProfileDto) {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.user.id !== userId) {
      throw new ForbiddenException('You cannot edit this profile');
    }

    Object.assign(profile, dto);
    return this.profileRepository.save(profile);
  }
}
