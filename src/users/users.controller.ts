import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOAuth2 } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @ApiBearerAuth()
  getUserInfo() {
    return 'hello world';
  }
}
