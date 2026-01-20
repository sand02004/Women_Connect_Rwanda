import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard) // Protect all routes
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 🔹 Create my profile
  @Post()
  @ApiOperation({summary: 'create new profile for authenticated user'})
  @ApiResponse({status: 201, description: "profile created successfuly"})
  async create(@Req() req, @Body() dto: CreateProfileDto) {
    const userId = req.user.sub; // assuming JWT has user id in sub
    return this.profileService.create(userId, dto);
  }

  // 🔹 Get my profile
  @Get('me')
  async getMyProfile(@Req() req) {
    const userId = req.user.sub;
    return this.profileService.findByUser(userId);
  }

  // 🔹 Update my profile
  @Put(':id')
  async update(
    @Param('id') profileId: string,
    @Req() req,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = req.user.sub;
    return this.profileService.update(profileId, userId, dto);
  }
}
