// import {
//   Controller,
//   Post,
//   Get,
//   Patch,
//   Body,
//   Param,
//   UseGuards,
// } from '@nestjs/common';
// import { ProfileService } from './profile.service';
// import { CreateProfileDto } from './dto/create-profile.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// // import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
// import { CurrentUser } from '../common/decorators/current-user.decorator';

// @UseGuards(JwtAuthGuard)
// @Controller('profile')
// export class ProfileController {
//   constructor(private readonly profileService: ProfileService) {}

//   // 🔹 Create my profile
//   @Post()
//   create(@CurrentUser() user, @Body() dto: CreateProfileDto) {
//     return this.profileService.create(user.id, dto);
//   }

//   // 🔹 Get my profile
//   @Get('me')
//   findMyProfile(@CurrentUser() user) {
//     return this.profileService.findByUser(user.id);
//   }

//   // 🔹 Update my profile
//   @Patch(':id')
//   update(
//     @Param('id') profileId: string,
//     @CurrentUser() user,
//     @Body() dto: UpdateProfileDto,
//   ) {
//     return this.profileService.update(profileId, user.id, dto);
//   }
// }
