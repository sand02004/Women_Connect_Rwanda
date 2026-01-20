import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
// import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from '@/src/auth/guards/roles.guards';
import { Roles } from '@/src/common/decorators/role.decorator';
import { Role } from '@/src/enum/role.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard) // apply globally to all routes in this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Create a new user (Admin only)
  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiResponse({ status: 201, type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, Role.ADMIN);
  }

  // 🔹 Get all users (Admin only) with optional pagination
  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.usersService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  // 🔹 Get a single user by ID (Admin or self)
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // 🔹 Update user info (Admin or self)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update user info (Admin or self)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // 🔹 Soft delete a user (Admin only)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete a user (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  // 🔹 Verify user email (Admin only)
  @Patch(':id/verify')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Verify a user email (Admin only)' })
  verify(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.verifyEmail(id);
  }
}
