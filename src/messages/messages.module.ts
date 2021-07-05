import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from 'src/chats/chats.module';
import { Participant } from 'src/chats/entities/participant.entity';

import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    TypeOrmModule.forFeature([Message, Participant]),
    forwardRef(() => ChatsModule),
  ],
  exports: [MessagesService],
})
export class MessagesModule {}
