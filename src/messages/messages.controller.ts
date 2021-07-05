import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUser.interface';

import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@UseGuards(JwtAuthGuard)
@Controller('messages')
@ApiResponse({ status: HttpStatus.UNAUTHORIZED })
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/create')
  @ApiResponse({ type: Message, status: HttpStatus.CREATED })
  create(
    @Req() request: RequestWithUser,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.create(request.user, createMessageDto);
  }

  @Get('')
  findAllByDate(@Param('date') date: Date) {
    return this.messagesService.getAllMessagesByDate(date);
  }

  @Put('/update/:id')
  update(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    updateMessageDto.id = id;
    return this.messagesService.update(request.user, updateMessageDto);
  }

  @Delete('/delete')
  delete(
    @Req() request: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.messagesService.softDelete(request.user, id);
  }
}
