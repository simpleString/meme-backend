import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum MessageStatus {
  Unread,
  Read,
}

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  chatId: string;

  @ApiHideProperty()
  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chatId' })
  @Exclude()
  chat: Chat;

  @ApiHideProperty()
  @Column()
  @Exclude()
  userId: string;

  @ApiHideProperty()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user: User;

  @Column()
  text: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @ApiHideProperty()
  @DeleteDateColumn({ type: 'timestamp with time zone' })
  @Exclude()
  deletedAt: Date;

  @ApiProperty({ enum: MessageStatus })
  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.Unread })
  status: MessageStatus;
}
