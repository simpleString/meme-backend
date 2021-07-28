import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsService } from 'src/chats/chats.service';
import { ParticipantEntity } from 'src/chats/entities/participant.entity';
import { FilesService } from 'src/files/files.service';
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
    private readonly filesService: FilesService,
  ) {}

  public getMessages(searchMessageDto: SearchMessageDto): MessageEntity {
    throw new Error('Method not implemented.');
  }
  public async createMessage(user: UserEntity, createMessageDto: CreateMessageDto) {
    const chat = await this.chatsService.findUsersChat(user.id, createMessageDto.userId);
    if (!chat) {
      const newChatId = await this.chatsService.create(user.id, createMessageDto.userId);
    }
    // TODO:: Create Attachment
    const attachment = await this.filesService.createAttachment(
      createMessageDto.attachment.type,
      createMessageDto.file.buffer,
      createMessageDto.file.mimetype,
      createMessageDto.file.filename,
    );
    const message = this.messageRepository.create({
      senderId: createMessageDto.userId,
      text: createMessageDto.text,
      attachment,
    });
    await this.messageRepository.save(message);
    return message.id;
  }
}
