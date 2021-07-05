import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participant } from './participant.entity';

@Entity('chat')
export class Chat extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @OneToMany(() => Participant, (participant) => participant.chat)
  participants: Participant[];

  @Column({ nullable: true })
  lastMsgId: string;

  @ApiProperty()
  @ManyToOne(() => Message, { nullable: true })
  @JoinColumn({ name: 'lastMsgId' })
  lastMsg: Message;
}
