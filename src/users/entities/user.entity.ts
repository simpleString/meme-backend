import { Exclude } from 'class-transformer';
import { IsMobilePhone } from 'class-validator';
import { Chat } from 'src/chats/entities/chat.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsMobilePhone()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;
}
