import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity1 } from 'src/chats/entities/message.entity';

import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { ChatEntity } from './entities/chat.entity';
import { ParticipantEntity } from './entities/participant.entity';
import { MessagesService } from './messages.service';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, MessagesService],
  imports: [TypeOrmModule.forFeature([ChatEntity, MessageEntity1, ParticipantEntity])],
  exports: [ChatsService],
})
export class ChatsModule {}
