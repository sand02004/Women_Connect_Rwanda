import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.modules';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { OpportunitiesModule } from './opportunities/opportunities.module'; // ✅ Import here

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    OpportunitiesModule, // ✅ Add it here
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class AppModule {}
