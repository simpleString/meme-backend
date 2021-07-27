import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsService } from 'src/chats/chats.service';
import { ParticipantEntity } from 'src/chats/entities/participant.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateMessageDto } from './dto/create-message.dto';
import { SearchMessageDto } from './dto/search-message.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(ParticipantEntity) private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(MessageEntity) private readonly messageRepository: Repository<MessageEntity>,
    private readonly chatsService: ChatsService,
  ) {}

  public getMessages(searchMessageDto: SearchMessageDto): MessageEntity {
    throw new Error('Method not implemented.');
  }
  public async createMessage(user: UserEntity, createMessageDto: CreateMessageDto) {
    const chat = await this.chatsService.findUsersChat(user.id, createMessageDto.userId);
    if (!chat) {
      const newChatId = await this.chatsService.create(user.id, createMessageDto.userId);
    }
    const message = this.messageRepository.create({ senderId });
  }
}
