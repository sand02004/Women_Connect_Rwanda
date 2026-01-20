import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Opportunity } from '../opportunities/entities/opportunity.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: Number(configService.get('DB_PORT')) || 5432,
        username: configService.get('DB_USERNAME') || 'postgres',
        password: configService.get('DB_PASSWORD') || 'admin123',
        database: configService.get('DB_NAME') || 'womenconnectrwanda',
        entities: [User, Opportunity],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
