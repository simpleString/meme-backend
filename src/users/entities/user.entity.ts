import { Chat } from 'src/chats/entities/chat.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Chat, (chat) => chat.users)
  chats: Chat[];

  @Column({ type: 'boolean', default: false })
  isActive: boolean;
}
