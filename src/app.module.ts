import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: configService.get<number>('PORT'),
        username: 'postgres',
        password: 'postgres',
        database: 'backend',
        synchronize: true,
        autoLoadEntities: true,
        logging: 'all',
      }),
    }),
    ConfigModule.forRoot(),
    UsersModule,
    ChatsModule,
    AuthModule,
  ],
})
export class AppModule {}
