import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BaseAuth } from 'src/auth/decorators/baseAuth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { MessagesService } from 'src/messages/messages.service';
import { UserEntity } from 'src/users/entities/user.entity';

import { CreateMessageDto } from './dto/create-message.dto';
import { SearchMessageDto } from './dto/search-message.dto';

@Controller('messages')
@BaseAuth('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  getMessages(
    @Query('userId', new ParseUUIDPipe()) userId: string,
    @Query('limit', new DefaultValuePipe(10), new ParseIntPipe()) limit: number = 10,
    @Query('offset', new DefaultValuePipe(0), new ParseIntPipe()) offset: number = 0,
  ) {
    const searchMessageDto: SearchMessageDto = { userId, limit, offset };
    return this.messagesService.getMessages(searchMessageDto);
  }

  @Post()
  sendMessage(@User() user: UserEntity, @Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.createMessage(user, createMessageDto);
  }
}
