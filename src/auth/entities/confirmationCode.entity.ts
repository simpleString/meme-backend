import { UserEntity } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConfirmationCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  code: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
