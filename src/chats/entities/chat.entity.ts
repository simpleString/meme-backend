import { User } from 'src/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chat')
export class Chat {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  users: User[];
}
