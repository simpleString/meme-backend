import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/chats/entities/message.entity';

import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { Participant } from './entities/participant.entity';
import { MessagesService } from './messages.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, MessagesService],
  imports: [TypeOrmModule.forFeature([Chat, Message, Participant])],
})
export class ChatsModule {}
