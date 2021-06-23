import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createChatDto: CreateChatDto) {
    let users: User[] = await this.userRepository.findByIds(
      createChatDto.users,
    );
    console.log(users);
    const chat = await this.getChatByUsers(users);
    const newChat = this.chatRepository.create({ users });
    const test = await this.userRepository.save(newChat);
    console.log(chat);
    console.log(newChat);
    return test;
  }

  getChatByUsers(users: any[]) {
    return this.chatRepository.findOne();
  }

  findAll() {
    this.chatRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
