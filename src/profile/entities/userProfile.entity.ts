import { FileEntity } from 'src/files/entities/file.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Gender {
  female,
  male,
  none,
}

@Entity()
export class UserProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  bio: string;

  @OneToMany(() => FileEntity, (photo) => photo.userProfile)
  photos: FileEntity[];
  // @Column()
  // location: Geometry;
}
