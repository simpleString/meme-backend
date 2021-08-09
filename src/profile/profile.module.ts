import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/providers/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { UserProfileEntity } from './entities/userProfile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [TypeOrmModule.forFeature([UserProfileEntity]), UsersModule, FilesModule],
})
export class ProfileModule {}
