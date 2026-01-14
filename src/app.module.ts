import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { SkillsModule } from './skills/skills.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { ApplicationModule } from './application/application.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5000,
      username: 'postgres',
      password: 'admin123',
      database: 'womenconnectrwanda',
      autoLoadEntities: true,
      synchronize: true, // dev only
    }),
    UsersModule,
    ProfileModule,
    SkillsModule,
    OpportunitiesModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
