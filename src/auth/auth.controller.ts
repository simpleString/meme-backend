import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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

  @ApiResponse({ type: TokensResponseDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: Unauthorized })
  @Post('/login')
  login(@Body() loginUserDto: CreateUserDto) {
    return this.authService.login(loginUserDto);
  }

  @ApiResponse({ type: TokensResponseDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: Unauthorized })
  @Post('/register')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.registration(createUserDto);
  }

  @ApiResponse({ type: AccessTokenDto, status: HttpStatus.OK })
  @ApiResponse({ type: Unauthorized, status: HttpStatus.UNAUTHORIZED })
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
  @ApiResponse({ type: Unauthorized, status: HttpStatus.UNAUTHORIZED })
  @UseGuards(JwtAuthGuard)
  logout(@Req() request: RequestWithUser) {
    this.authService.logout(request.user);
  }
}
