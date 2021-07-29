import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TagEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
}
