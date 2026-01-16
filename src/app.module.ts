import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database.modules';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
