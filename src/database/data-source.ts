import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres', // or mysql
  host: 'localhost',
  port: 5000,
  username: 'postgres',
  password: 'admin123',
  database: '',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false, 
});
