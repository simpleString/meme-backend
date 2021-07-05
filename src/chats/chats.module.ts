import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesModule } from 'src/messages/messages.module';

import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { Participant } from './entities/participant.entity';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [
    TypeOrmModule.forFeature([Chat, Message, Participant]),
    forwardRef(() => MessagesModule),
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
