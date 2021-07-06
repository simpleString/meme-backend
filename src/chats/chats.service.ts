import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/chats/entities/message.entity';
import { MessagesService } from 'src/chats/messages.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { ChatIdDto } from './dto/chatId.dto';
import { Chat } from './entities/chat.entity';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  async create(user: User, userId: string) {
    if (user.id === userId)
      throw new HttpException(
        'User cannot start chat with himself.',
        HttpStatus.BAD_REQUEST,
      );
    let chat: Chat;
    try {
      chat = await this.findUsersChat(user.id, userId);
    } catch (err) {}
    if (chat)
      throw new HttpException('Chat already exists', HttpStatus.BAD_REQUEST);
    try {
      chat = await this.chatRepository.create().save();
      await this.participantRepository
        .create({ userId: user.id, chatId: chat.id })
        .save();
      await this.participantRepository
        .create({ userId: userId, chatId: chat.id })
        .save();
      return chat as ChatIdDto;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async findUsersChat(userAId: string, userBId: string) {
    try {
      const result = await this.chatRepository
        .createQueryBuilder('chat')
        .innerJoinAndSelect(
          'chat.participants',
          'participant',
          'participant.userId = :userId',
          { userId: userAId },
        )
        .innerJoinAndSelect(
          'chat.participants',
          'anotherParticipant',
          'anotherParticipant.userId = :anotherUserId',
          { anotherUserId: userBId },
        )
        .getOneOrFail();

      return await this.chatRepository.findOneOrFail(result.id, {
        relations: ['participants', 'participants.user', 'lastMsg'],
      });
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  public async updateLastMsgToChat(chatId: string, msg: Message) {
    const chat = await this.chatRepository.findOne(chatId);
    await this.chatRepository.update(chat, { lastMsg: msg });
    return chat;
  }

  async findAllUserChats(user: User) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .leftJoinAndSelect('chat.lastMsg', 'lastMsg')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chat.id')
          .from(Participant, 'participant')
          .where('participant.userId = :userId')
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .setParameter('userId', user.id)
      .getMany();
  }
}
