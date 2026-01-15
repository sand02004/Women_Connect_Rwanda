// src/users/entities/user.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../enum/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.WOMAN })
  role: Role;

  @Column({ default: false })
  isVerified: boolean;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Alias export (this is OK)
export { Role as UserRole };
