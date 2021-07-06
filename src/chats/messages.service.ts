import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatsService } from 'src/chats/chats.service';
import { Participant } from 'src/chats/entities/participant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @Inject(forwardRef(() => ChatsService))
    private readonly chatsService: ChatsService,
  ) {}

  async create(user: User, createMessageDto: CreateMessageDto) {
    try {
      const participant = await this.participantRepository.findOneOrFail({
        where: { userId: user.id, chatId: createMessageDto.chatId },
      });
      const message = this.messageRepository.create({
        ...createMessageDto,
        user: user,
      });
      await this.messageRepository.save(message);
      await this.chatsService.updateLastMsgToChat(
        createMessageDto.chatId,
        message,
      );
      return message;
    } catch (error) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }

  getAllMessagesByDate(date: Date) {
    const messages = this.messageRepository.find({
      where: { createdDate: date },
    });
    return messages;
  }

  async findLastMessage(chatId: string) {
    const message = await this.messageRepository.findOne({
      where: { chatId },
      order: { createdAt: 'DESC' },
    });
    return message;
  }

  async update(user: User, updateMessageDto: UpdateMessageDto) {
    try {
      const message = await this.messageRepository.findOneOrFail({
        where: { user, id: updateMessageDto.messageId },
      });
      await this.messageRepository.update(message, {
        text: updateMessageDto.text,
        status: updateMessageDto.status,
      });
      return message;
    } catch (error) {
      throw new HttpException("Message don't exist", HttpStatus.NOT_FOUND);
    }
  }

  async softDelete(user: User, id: string) {
    try {
      const message = await this.messageRepository.findOneOrFail({
        where: { user, id },
      });
      //TODO:: Change last message when soft delete current last message.
      await this.chatsService.updateLastMsgToChat(message.chatId, message);
      return await message.softRemove();
    } catch (error) {
      throw new HttpException("Message don't exist", HttpStatus.NOT_FOUND);
    }
  }

  async findMessagesByDate(date: Date, chatId: string) {
    const upperDate = new Date(date.toISOString());
    upperDate.setDate(upperDate.getDate() + 1);
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.createdAt >= :date', { date })
      .andWhere('message.createdAt <= :upperDate', { upperDate })
      .andWhere('message.chatId = :chatId', { chatId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();
    return messages;
  }

  async findMessagesById(messageId: string, limit = 10) {
    const message = await this.messageRepository.findOneOrFail({
      where: { id: messageId },
    });
    const messages = await this.messageRepository.find({
      where: { chatId: message.chatId },
      order: { createdAt: 'DESC' },
      skip: 1,
      take: limit,
    });
    console.log(messages);
    return messages;
  }
}
