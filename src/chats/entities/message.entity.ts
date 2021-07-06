import { ApiProperty } from '@nestjs/swagger';
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
  UpdateDateColumn,
} from 'typeorm';

export enum MessageStatus {
  Unread,
  Read,
  Updated,
}

@Entity()
export class Message extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  chatId: string;

  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chatId' })
  @Exclude()
  chat: Chat;

  @Column()
  @Exclude()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @Exclude()
  user: User;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp with time zone', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  @Exclude()
  deletedAt: Date;

  @ApiProperty({ enum: MessageStatus })
  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.Unread })
  status: MessageStatus;
}
