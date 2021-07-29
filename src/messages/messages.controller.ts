import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiQuery } from '@nestjs/swagger';
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

  // FIXME:: Fix file uploading
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  sendMessage(
    @User() user: UserEntity,
    @UploadedFile() file:         Express.Multer.File,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    createMessageDto.file = file;
    console.log(createMessageDto);

    return this.messagesService.createMessage(user, createMessageDto);
  }
}
