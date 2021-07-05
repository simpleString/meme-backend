import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUser.interface';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';

@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiTags('chats')
@ApiBearerAuth()
@ApiResponse({ type: ErrorResponseDto, status: HttpStatus.UNAUTHORIZED })
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

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

  @Get('/messages')
  findAllMessages(
    @Query('date') date: string,
    @Query('messageId') messageId: string,
    @Query('limit', ParseBoolPipe) limit: number,
  ) {
    if (messageId && date) {
      throw new HttpException(
        'You cannot searching in date and message Id queries',
        HttpStatus.BAD_REQUEST,
      );
      // return this.chatsService.getMessages()
    }
  }
}
