import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/providers/email/email.module';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfirmationCodeEntity } from './entities/confirmationCode.entity';
import { TokenEntity } from './entities/token.entity';
import { JwtStrategy } from './stategies/jwt.strategy';
import { JwtRefreshStrategy } from './stategies/refresh-jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  imports: [
    PassportModule,
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_TOKEN_EXP'),
        },
      }),
    }),
    TypeOrmModule.forFeature([TokenEntity, ConfirmationCodeEntity]),
    EmailModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
