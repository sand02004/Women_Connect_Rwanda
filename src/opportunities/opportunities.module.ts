import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { Opportunity } from './entities/opportunity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity])],
  providers: [OpportunitiesService],
  controllers: [OpportunitiesController],
})
export class OpportunitiesModule {}
