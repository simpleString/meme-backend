import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { MessageEntity } from 'src/chats/entities/message.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ParticipantEntity } from './participant.entity';

@Entity('chat')
export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => ParticipantEntity, (participant) => participant.chat)
  participants: ParticipantEntity[];

  @Column({ nullable: true })
  @ApiHideProperty()
  @Exclude()
  lastMsgId: string;

  @ManyToOne(() => MessageEntity, { nullable: true })
  @JoinColumn({ name: 'lastMsgId' })
  lastMsg: MessageEntity;
}
