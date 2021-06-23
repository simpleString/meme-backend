import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Chat } from './chat.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  text: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Chat)
  chat: Chat;
}
