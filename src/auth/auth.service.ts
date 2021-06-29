import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { ITokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const refreshTokenPayload: ITokenPayload = { userId: user.id };
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXP'),
    });
    const refreshTokenInstance = await this.generateRefreshToken(
      user.id,
      refreshToken,
    );
    const accessToken = await this.generateAccessToken(refreshTokenInstance.id);
    return { accessToken, refreshToken };
  }

  login() {}

  generateAccessToken(refreshTokenId: string) {
    const accessTokenPayload = { refreshTokenId };
    return this.jwtService.signAsync(accessTokenPayload);
  }

  async generateRefreshToken(userId: string, refreshToken: string) {
    const token = this.tokenRepository.create({ userId, refreshToken });
    await this.tokenRepository.save(token);
    return token;
  }
}
