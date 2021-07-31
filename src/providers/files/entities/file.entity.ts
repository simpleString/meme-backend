import { UserProfileEntity } from 'src/profile/entities/userProfile.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum LoadingStatus {
  Loading,
  Done,
  Error,
}

export enum AttachmentType {
  Photo,
  Meme,
}

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('enum', { default: LoadingStatus.Loading, enum: LoadingStatus })
  loadingStatus: LoadingStatus;
  @Column()
  key: string;

  @Column('enum', { default: AttachmentType.Photo, enum: AttachmentType })
  type: AttachmentType;

  @ManyToOne(() => UserProfileEntity, (user) => user.photos)
  userProfile: UserProfileEntity;
}
