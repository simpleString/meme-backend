import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserEntity } from 'src/users/entities/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ChatEntity } from './chat.entity';

@Entity()
export class ParticipantEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiHideProperty()
  @Column()
  @Exclude()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ApiHideProperty()
  @Column()
  @Exclude()
  chatId: string;

  @ApiHideProperty()
  @ManyToOne(() => ChatEntity)
  @JoinColumn({ name: 'chatId' })
  chat: ChatEntity;
}
