import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { DatabaseModule } from './database/database.module';
import { LikesModule } from './likes/likes.module';
import { MatchesModule } from './matches/matches.module';
import { MemesModule } from './memes/memes.module';
import { MessagesModule } from './messages/messages.module';
import { ProfileModule } from './profile/profile.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    ChatsModule,
    AuthModule,
    MemesModule,
    MessagesModule,
    ProfileModule,
    TagsModule,
    MatchesModule,
    LikesModule,
    DatabaseModule,
    FilesModule,
  ],
})
export class AppModule {}
