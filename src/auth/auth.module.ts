import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Token } from './entities/token.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PassportModule,
    UsersModule,
    ConfigModule,
    JwtModule.register({
      secret: 'test',
      signOptions: {
        expiresIn: '30s',
      },
    }),
    TypeOrmModule.forFeature([Token]),
  ],
})
export class AuthModule {}
