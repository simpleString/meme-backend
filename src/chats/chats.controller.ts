import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUser.interface';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { ParseUUIDNullPipe } from 'src/common/dto/pipes/parse-uuid-null.pipe';

import { ChatsService } from './chats.service';
import { ChatIdDto } from './dto/chatId.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiTags('chats')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: ErrorResponseDto })
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Post('/:userId')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOperation({ summary: 'Start chat with user' })
  startChat(
    @Req() request: RequestWithUser,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ChatIdDto> {
    return this.chatsService.create(request.user, userId);
  }

  @Get('/find/:userId')
  @ApiOperation({ summary: 'Find chat with user' })
  findChatWithUser(
    @Req() request: RequestWithUser,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.chatsService.findUsersChat(request.user.id, userId);
  }

  @Get()
  @ApiOperation({ summary: "Search all user's chats" })
  findAllUserChats(@Req() request: RequestWithUser) {
    return this.chatsService.findAllUserChats(request.user);
  }

  @ApiQuery({
    name: 'date',
    required: false,
    description: "Pass date with timezone otherwise it'll be +0",
  })
  @ApiQuery({ name: 'messageId', required: false })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'default value: 10',
  })
  @ApiQuery({ name: 'chatId', required: false })
  @Get('/messages/search')
  @ApiOperation({
    summary: 'Search messages',
    description:
      'Cat search eather with date and chatId or messageId and limit.',
  })
  findAllMessages(
    @Query('date') date?: string,
    @Query('messageId', new ParseUUIDNullPipe()) messageId?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('chatId', new ParseUUIDNullPipe()) chatId?: string,
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

  @Post('/:chatId/messages')
  @ApiOperation({ summary: 'Create message' })
  create(
    @Req() request: RequestWithUser,
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    createMessageDto.chatId = chatId;
    return this.messagesService.create(request.user, createMessageDto);
  }

  @Put('/messages/:messageId')
  @ApiOperation({ summary: 'Update message' })
  update(
    @Req() request: RequestWithUser,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    updateMessageDto.messageId = messageId;
    return this.messagesService.update(request.user, updateMessageDto);
  }

  @Put('/messages/:messageId/status')
  @ApiOperation({ summary: 'Update message status' })
  updateStatus(
    @Req() request: RequestWithUser,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() updateMessageStatusDto: UpdateMessageStatusDto,
  ) {
    updateMessageStatusDto.messageId = messageId;
    return this.messagesService.updateMessageStatus(
      request.user,
      updateMessageStatusDto,
    );
  }

  @Delete('/messages/:messageId')
  @ApiNotFoundResponse()
  @ApiOperation({ summary: 'Delete message' })
  delete(
    @Req() request: RequestWithUser,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ) {
    return this.messagesService.softDelete(request.user, messageId);
  }
}
