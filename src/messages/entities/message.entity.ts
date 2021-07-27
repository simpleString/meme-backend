import { ApiHideProperty } from '@nestjs/swagger';
import { AttachmentEntity } from 'src/files/entities/attachment.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum MessageStatus {
  Read,
  Delivered,
}

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  text: string;
  @Column('uuid')
  senderId: string;
  @ApiHideProperty()
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  sender: UserEntity;
  @Column('enum', { default: MessageStatus.Delivered })
  status: MessageStatus;
  @Column('time with time zone')
  timestamp: Date;
  @ManyToOne(() => AttachmentEntity)
  attachment: AttachmentEntity;
}
