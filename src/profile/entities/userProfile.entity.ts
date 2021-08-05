import { Point } from 'geojson';
import { FileEntity } from 'src/providers/files/entities/file.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  bio: string;

  @OneToMany(() => FileEntity, (file) => file.userProfile)
  photos: FileEntity[];

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;
}
