import { Module } from '@nestjs/common';
import { ChatsModule } from 'src/chats/chats.module';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [ChatsModule],
})
export class MessagesModule {}
