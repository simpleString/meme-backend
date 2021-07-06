import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUser.interface';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { ParseUUIDNullPipe } from 'src/common/dto/pipes/parse-uuid-null.pipe';

import { ChatsService } from './chats.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageSearchDto } from './dto/message-search.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiTags('chats')
@ApiBearerAuth()
@ApiResponse({ type: ErrorResponseDto, status: HttpStatus.UNAUTHORIZED })
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post('/:userId')
  @ApiResponse({ type: Chat, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST })
  startChat(
    @Req() request: RequestWithUser,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.chatsService.create(request.user, userId);
  }

  @Get('/find/:userId')
  findChatWithUser(
    @Req() request: RequestWithUser,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.chatsService.findUsersChat(request.user.id, userId);
  }

  @Get()
  @ApiResponse({ type: Chat, status: HttpStatus.OK })
  findAllUserChats(@Req() request: RequestWithUser) {
    return this.chatsService.findAllUserChats(request.user);
  }

  @Get('/messages/search')
  findAllMessages(
    @Query('date') date: string,
    @Query('messageId', new ParseUUIDNullPipe()) messageId: string,
    @Query('limit', new DefaultValuePipe(0), ParseIntPipe) limit: number,
    @Query('chatId', new ParseUUIDNullPipe()) chatId: string,
  ) {
    if (messageId && date) {
      throw new HttpException(
        'You cannot searching in date and message Id queries',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (date && chatId) {
      const dateResult = new Date(date);
      console.log(dateResult.toISOString());
      return this.messagesService.findMessagesByDate(dateResult, chatId);
    }
    if (messageId) {
      return this.messagesService.findMessagesById(messageId, limit);
    }
  }

  @Post('/messages/:chatId')
  @ApiResponse({ type: Message, status: HttpStatus.CREATED })
  create(
    @Req() request: RequestWithUser,
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    createMessageDto.chatId = chatId;
    return this.messagesService.create(request.user, createMessageDto);
  }

  @Put('/messages/:messageId')
  update(
    @Req() request: RequestWithUser,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    updateMessageDto.messageId = messageId;
    return this.messagesService.update(request.user, updateMessageDto);
  }

  @Delete('/messages/:messageId')
  delete(
    @Req() request: RequestWithUser,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.messagesService.softDelete(request.user, messageId);
  }
}
