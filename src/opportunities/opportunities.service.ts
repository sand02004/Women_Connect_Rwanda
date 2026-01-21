import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, FindManyOptions } from 'typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateOpportunityDto } from './dto/create-opportunity.dto'; // ✅ Import DTO

@Injectable()
export class OpportunitiesService {
  private readonly logger = new Logger(OpportunitiesService.name);

  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
  ) {}

  // 🔹 Create an opportunity

  async createOpportunity(dto: CreateOpportunityDto) {
    const opportunity = this.opportunityRepository.create({
      ...dto,
      deadline: new Date(dto.deadline),
    });

    return this.opportunityRepository.save(opportunity);
  }

  // 🔹 Get single opportunity by ID
  async findOne(id: string) {
    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
    });

    if (!opportunity) {
      throw new Error(`Opportunity with id ${id} not found`);
    }

    return opportunity;
  }

  // 🔹 Manually expire a single opportunity
  async expireOpportunity(id: string) {
    const opportunity = await this.findOne(id);

    if (opportunity.isExpired) {
      return { message: 'Opportunity is already expired', opportunity };
    }

    opportunity.isExpired = true;
    await this.opportunityRepository.save(opportunity);

    return { message: 'Opportunity expired successfully', opportunity };
  }

  // 🔹 Get all opportunities (with optional pagination)
  async findAll(options?: { skip?: number; take?: number }) {
    const findOptions: FindManyOptions<Opportunity> = {
      where: { isExpired: false }, // only active opportunities
      skip: options?.skip,
      take: options?.take,
      order: { deadline: 'ASC' }, // earliest deadlines first
    };

    return this.opportunityRepository.find(findOptions);
  }

  // 🔹 Cron job to auto-expire opportunities
  // Runs automatically every minute (or change CronExpression as needed)
  // ✅ This is where scheduled automatic expiration happens
  @Cron(CronExpression.EVERY_MINUTE)
  async expireOpportunities() {
    this.logger.log('Cron Job: Checking expired opportunities...');

    const now = new Date();

    // Find all opportunities whose deadline has passed and are not yet expired
    const toExpire = await this.opportunityRepository.find({
      where: { deadline: LessThan(now), isExpired: false },
    });

    // No opportunities to expire
    if (toExpire.length === 0) {
      this.logger.log('Cron Job: No opportunities to expire');
      return;
    }

    // Expire each opportunity and log it
    for (const opp of toExpire) {
      opp.isExpired = true;
      await this.opportunityRepository.save(opp);
      this.logger.log(`Opportunity expired: ${opp.title} (${opp.id})`);
    }
  }
}
