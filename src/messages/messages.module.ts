import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsModule } from 'src/chats/chats.module';
import { ParticipantEntity } from 'src/chats/entities/participant.entity';
import { FilesModule } from 'src/files/files.module';

import { MessageEntity } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [TypeOrmModule.forFeature([ParticipantEntity, MessageEntity]), ChatsModule, FilesModule],
})
export class MessagesModule {}
