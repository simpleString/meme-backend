import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get user info' })
  getUserInfo(@User() user: UserEntity): UserEntity {
    console.log(user);

    return user;
  }

  // @Get('/lastActive/:userId')
  // @ApiOperation({ summary: 'Get last user active' })
  // getLastUserActive(
  //   @Param('userId', ParseUUIDPipe) userId: string,
  // ): Promise<UserActiveDto> {
  //   return this.usersService.getUserLastActive(userId);
  // }
}
