import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    private readonly usersService: UsersService,
  ) {}

  async create(createChatDto: CreateChatDto) {
    const chat = await this.getChatByUsersId(...createChatDto.users);
    if (chat)
      throw new HttpException('Chat already exists', HttpStatus.BAD_REQUEST);
    const users = await this.usersService.getUsersByIds(createChatDto.users);
    // const newChat = this.chatRepository.create(users);
    // return await this.chatRepository.save(newChat);
  }

  getChatByUsersId(user1Id: string, user2Id: string) {
    const chatSubquery = this.chatRepository
      .createQueryBuilder('innerChat')
      .select('innerChat.id')
      .leftJoin('innerChat.users', 'innerUser')
      .where('innerUser.id = :innerId');

    return this.chatRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.users', 'user')
      .where('user.id = :id', { id: user1Id })
      .andWhere('chat.id = ' + '(' + chatSubquery.getQuery() + ')')
      .setParameter('innerId', user2Id)
      .getMany();
  }

  findAll() {
    this.chatRepository.find();
  }

  findOne(id: string) {
    return this.chatRepository.findOne(id);
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
