import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.enity';
import { User } from 'src/users/entities/user.entity';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [TypeOrmModule.forFeature([Chat, Message, User])],
})
export class ChatsModule {}
