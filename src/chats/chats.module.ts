import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { UsersModule } from 'src/users/users.module';
import { Message } from 'src/messages/entities/message.entity';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [TypeOrmModule.forFeature([Chat, Message]), UsersModule],
})
export class ChatsModule {}
