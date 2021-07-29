import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProfileEntity } from './entities/userProfile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [TypeOrmModule.forFeature([UserProfileEntity])],
})
export class ProfileModule {}
