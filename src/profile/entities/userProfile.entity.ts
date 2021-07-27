import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum Gender {
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
  age: Number;

  // @ManyToOne()
  @Column({ type: 'enum', enum: Gender })
  gender: Gender;
}
