import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
