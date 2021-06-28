import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOAuth2 } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  // @ApiBearerAuth()
  @ApiOAuth2(['user'])
  getUserInfo() {
    return 'hello world';
  }
}
