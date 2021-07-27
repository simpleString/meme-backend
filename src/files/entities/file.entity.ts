import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum LoadingStatus {
  Loading,
  Done,
  Error,
}

@Entity()
export class FileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('enum', { default: LoadingStatus.Loading })
  loadingStatus: LoadingStatus;
  @Column()
  key: string;
}
