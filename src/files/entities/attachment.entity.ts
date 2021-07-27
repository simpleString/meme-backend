import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { FileEntity } from './file.entity';

export enum AttachmentType {
  Photo,
  Meme,
}

@Entity()
export class AttachmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('enum', { default: AttachmentType.Photo })
  type: AttachmentType;
  @ManyToOne(() => FileEntity)
  content: FileEntity;
}
