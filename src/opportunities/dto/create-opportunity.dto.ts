import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty({ example: 'Women in Tech Scholarship' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'A program supporting young women interested in technology',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2026-02-15T23:59:59.000Z',
    description: 'Deadline for the opportunity',
  })
  @IsDateString()
  deadline: string; // ISO string from client
}
