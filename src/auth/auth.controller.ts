import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { Unauthorized } from './dto/unauthorized.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RequestWithUser } from './interfaces/requestWithUser.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ type: TokensResponseDto })
  @ApiBadRequestResponse({ type: Unauthorized })
  @Post('/login')
  login(@Body() loginUserDto: CreateUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiCreatedResponse({ type: TokensResponseDto })
  @ApiBadRequestResponse({ type: Unauthorized })
  @Post('/register')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @ApiOkResponse({ type: AccessTokenDto })
  @ApiBadRequestResponse({ type: Unauthorized })
  @UseGuards(JwtRefreshAuthGuard)
  @Get('/refresh')
  refresh(
    @Req() request: RequestWithUser,
    @Body('refresh_token') refreshToken: string,
  ) {
    return this.authService.refreshAccessToken(request.user, refreshToken);
  }

  @Get('/logout')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ type: Unauthorized })
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: RequestWithUser) {
    this.authService.logout(request.user);
  }
}
