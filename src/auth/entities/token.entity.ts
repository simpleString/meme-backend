import { UserEntity } from 'src/users/entities/user.entity';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  refreshToken: string;

  @Column()
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @DeleteDateColumn()
  deletedAt?: Date;
}
