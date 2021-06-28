import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post()
  login() {}

  @Post()
  registration() {}

  @Get()
  refresh() {}
}
