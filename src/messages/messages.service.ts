import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    message.user;
    return this.messageRepository.save(message);
  }

  getAllMessagesByDate(date: Date) {
    const messages = this.messageRepository.find({
      where: { createdDate: date },
    });
    return messages;
  }

  // findLastMessagesByChat() {
  //   const messages = this.messageRepository.find({
  //     where:
  //   })
  // }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
