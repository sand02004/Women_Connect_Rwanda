import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { Opportunity } from './entities/opportunity.entity';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { RolesGuard } from './../auth/guards/roles.guards';
import { Roles } from '../common/decorators/role.decorator';
import { Role } from '../enum/role.enum';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';

@ApiTags('Opportunities')
// @ApiBearerAuth()
@Controller('opportunities')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  // 🔹 Create a new opportunity (Admin or Sponsor only)
  @Post()
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Create a new opportunity (Admin/Sponsor only)' })
  @ApiResponse({
    status: 201,
    description: 'Opportunity created successfully',
    type: Opportunity,
  })
  async create(@Body() dto: CreateOpportunityDto) {
    return this.opportunitiesService.createOpportunity(dto);
  }

  // 🔹 Get all opportunities (active only by default)
  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  @ApiQuery({
    name: 'skip',
    required: false,
    description: 'Number of opportunities to skip',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of opportunities to take',
  })
  @ApiResponse({
    status: 200,
    description: 'List of opportunities',
    type: [Opportunity],
  })
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.opportunitiesService.findAll({
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
    });
  }

  // 🔹 Get a single opportunity by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get a single opportunity by ID' })
  @ApiResponse({
    status: 200,
    description: 'Opportunity details',
    type: Opportunity,
  })
  findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(id);
  }

  // 🔹 Optionally, mark opportunity as expired manually (Admin/Sponsor)
  @Patch(':id/expire')
  @Roles(Role.ADMIN, Role.MENTOR)
  @ApiOperation({ summary: 'Manually expire an opportunity' })
  expire(@Param('id') id: string) {
    return this.opportunitiesService.expireOpportunity(id);
  }
}
