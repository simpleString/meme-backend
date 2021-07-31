import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { LikesModule } from './likes/likes.module';
import { MatchesModule } from './matches/matches.module';
import { MemesModule } from './memes/memes.module';
import { MessagesModule } from './messages/messages.module';
import { ProfileModule } from './profile/profile.module';
import { DatabaseModule } from './providers/database/database.module';
import { EmailModule } from './providers/email/email.module';
import { FilesModule } from './providers/files/files.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

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
    EmailModule,
  ],
})
export class AppModule {}
