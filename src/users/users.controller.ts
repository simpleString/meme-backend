import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUser.interface';

import { UserActiveDto } from './dto/user-active.dtc';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUserInfo(@Req() request: RequestWithUser): User {
    return request.user;
  }

  @Get('/lastActive/:userId')
  getLastUserActive(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserActiveDto> {
    return this.usersService.getUserLastActive(userId);
  }
}
