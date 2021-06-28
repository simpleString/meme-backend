import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatsModule } from './chats/chats.module';
import { Chat } from './chats/entities/chat.entity';

import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/entities/message.entity';
import { Token } from './auth/entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'backend',
      entities: [User, Chat, Message, Token],
      synchronize: true,
    }),
    UsersModule,
    ChatsModule,
    AuthModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
