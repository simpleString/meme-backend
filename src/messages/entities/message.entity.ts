import { ApiHideProperty } from '@nestjs/swagger';
import { FileEntity } from 'src/files/entities/file.entity';
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
  @Column('enum', { default: MessageStatus.Delivered, enum: MessageStatus })
  status: MessageStatus;
  @Column('timestamp with time zone', { default: new Date() })
  timestamp: Date;
  @ManyToOne(() => FileEntity)
  attachment: FileEntity;
}
