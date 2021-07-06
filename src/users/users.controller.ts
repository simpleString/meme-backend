import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/requestWithUser.interface';

import { UserActiveDto } from './dto/user-active.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user info' })
  getUserInfo(@Req() request: RequestWithUser): User {
    console.log(request.user);

    return request.user;
  }

  @Get('/lastActive/:userId')
  @ApiOperation({ summary: 'Get last user active' })
  getLastUserActive(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserActiveDto> {
    return this.usersService.getUserLastActive(userId);
  }
}
