import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Chat } from './chat.entity';

@Entity()
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiHideProperty()
  @Column()
  @Exclude()
  chatId: string;

  @ApiHideProperty()
  @ManyToOne(() => Chat)
  @JoinColumn({ name: 'chatId' })
  chat: Chat;
}
