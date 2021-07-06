import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Message } from 'src/chats/entities/message.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Participant } from './participant.entity';

@Entity('chat')
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Participant, (participant) => participant.chat)
  participants: Participant[];

  @Column({ nullable: true })
  @ApiHideProperty()
  @Exclude()
  lastMsgId: string;

  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'lastMsgId' })
  lastMsg: Message;
}
