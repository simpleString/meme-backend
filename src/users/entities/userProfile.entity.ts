import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum Gender {
  female,
  male,
  none,
}

@Entity()
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  age: Number;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;
}
