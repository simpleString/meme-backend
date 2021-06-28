import { ApiProperty } from '@nestjs/swagger';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

enum MessageStatus {
  Unread,
  Read,
}

@Entity()
export class Message {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.users)
  chat: Chat;

  @ManyToOne(() => User)
  user: User;

  @ApiProperty()
  @Column()
  text: string;

  @CreateDateColumn({ type: 'time with time zone' })
  createdDate: Date;

  @ApiProperty({ enum: MessageStatus })
  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.Unread })
  status: MessageStatus;
}
