import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/providers/email/email.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import { AccessTokenDto } from './dto/access-token.dto';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { ConfirmationCodeEntity } from './entities/confirmationCode.entity';
import { TokenEntity } from './entities/token.entity';
import { IAccessTokenPayload, IRefreshTokenPayload } from './interfaces/tokenPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>,
    @InjectRepository(ConfirmationCodeEntity)
    private readonly confirmationCodeRepository: Repository<ConfirmationCodeEntity>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    console.log(typeof createUserDto.password);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const confirmationCode = this.generateConfirmationCode();
    const confirmationCodeInstance = this.confirmationCodeRepository.create({ code: confirmationCode, user });
    await this.confirmationCodeRepository.save(confirmationCodeInstance);

    await this.emailService.sendConfirmation(confirmationCode);
    // return await this.generateTokens(user);
  }

  async login(loginUserDto: CreateUserDto) {
    const user = await this.usersService.getUserByPhone(loginUserDto.phone);
    if (!user) {
      throw new HttpException("Phone or password don't match", HttpStatus.BAD_REQUEST);
    }
    if (!(await bcrypt.compare(loginUserDto.password, user.password)))
      throw new HttpException("Phone or password don't match", HttpStatus.BAD_REQUEST);
    if (!user.isActivated) throw new BadRequestException('User not activated.');
    return await this.generateTokens(user);
  }

  async confirmRegistrationCode(userData: ConfirmCodeDto) {
    const user = await this.usersService.getUserByPhone(userData.phone);
    if (!user) throw new NotFoundException('User not found.');
    if (!(await bcrypt.compare(userData.password, user.password)))
      throw new BadRequestException("Phone or password don't match");

    const confirmationCode = await this.confirmationCodeRepository.findOne({
      where: { code: userData.code, user },
      order: { createdAt: 'DESC' },
    });
    if (confirmationCode) {
      return await this.usersService.activateUser(user);
    }
    throw new BadRequestException('Confirmation code do not match.');
  }

  private generateConfirmationCode = () => Math.floor(100000 + Math.random() * 900000);

  async logout(user: UserEntity) {
    const refreshToken = await this.tokenRepository.findOne({
      where: { user },
    });
    this.tokenRepository.softDelete(refreshToken);
  }

  async refreshAccessToken(user: UserEntity, refreshToken: string) {
    const refreshTokenInstance = await this.tokenRepository.findOne({
      where: { userId: user.id, refreshToken: refreshToken },
    });
    const accessToken = await this.generateAccessToken({
      userId: refreshTokenInstance.userId,
      refreshTokenId: refreshTokenInstance.id,
    });
    return { access_token: accessToken } as AccessTokenDto;
  }

  private async generateTokens(user: UserEntity) {
    const refreshTokenPayload: IRefreshTokenPayload = { userId: user.id };
    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXP'),
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
    const refreshTokenInstance = await this.generateRefreshToken(user.id, refreshToken);
    const accessToken = await this.generateAccessToken({
      userId: user.id,
      refreshTokenId: refreshTokenInstance.id,
    });
    return { accessToken, refreshToken };
  }

  private generateAccessToken(AccessTokenPayload: IAccessTokenPayload) {
    return this.jwtService.signAsync(AccessTokenPayload);
  }

  private async generateRefreshToken(userId: string, refreshToken: string) {
    const token = this.tokenRepository.create({ userId, refreshToken });
    await this.tokenRepository.save(token);
    return token;
  }

  public async getUserByRefreshTokenAndUserId(refreshToken: string, userId: string) {
    return (
      await this.tokenRepository.findOne({
        where: { refreshToken, userId },
        relations: ['user'],
      })
    )?.user;
  }
}
