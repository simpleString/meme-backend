import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/chats/entities/message.entity';
import { MessagesService } from 'src/chats/messages.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { ChatEntity } from './entities/chat.entity';
import { ParticipantEntity } from './entities/participant.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity) private readonly chatRepository: Repository<ChatEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  async create(userAId: string, userBId: string): Promise<string> {
    if (userAId === userBId) throw new HttpException('User cannot start chat with himself.', HttpStatus.BAD_REQUEST);
    let chat: ChatEntity;
    try {
      chat = await this.chatRepository.create().save();
      await this.participantRepository.create({ userId: userAId, chatId: chat.id }).save();
      await this.participantRepository.create({ userId: userBId, chatId: chat.id }).save();
      return chat.id;
    } catch (error) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async findUsersChat(userAId: string, userBId: string) {
    try {
      const result = await this.chatRepository
        .createQueryBuilder('chat')
        .innerJoinAndSelect('chat.participants', 'participant', 'participant.userId = :userId', { userId: userAId })
        .innerJoinAndSelect('chat.participants', 'anotherParticipant', 'anotherParticipant.userId = :anotherUserId', {
          anotherUserId: userBId,
        })
        .getOneOrFail();

      return await this.chatRepository.findOneOrFail(result.id, {
        relations: ['participants', 'participants.user', 'lastMsg'],
      });
    } catch (error) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  public async updateLastMsgToChat(chatId: string, msg: MessageEntity) {
    const chat = await this.chatRepository.findOne(chatId);
    await this.chatRepository.update(chat, { lastMsg: msg });
    return chat;
  }

  async findAllUserChats(user: UserEntity) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'user')
      .leftJoinAndSelect('chat.lastMsg', 'lastMsg')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('chat.id')
          .from(ParticipantEntity, 'participant')
          .where('participant.userId = :userId')
          .getQuery();
        return 'chat.id IN ' + subQuery;
      })
      .setParameter('userId', user.id)
      .getMany();
  }
}
