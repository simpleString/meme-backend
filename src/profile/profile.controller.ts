import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { BaseAuth } from 'src/auth/decorators/baseAuth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@BaseAuth('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getUserInfo(@User() user: UserEntity) {
    this.profileService.getUserInfo(user.id);
  }

  @Get('/:userId')
  getUserInfoById(@Param('userId', ParseUUIDPipe) userId: string) {
    this.profileService.getUserInfo(userId);
  }

  @Post()
  createUserProfile(@Body() createProfileDto: CreateProfileDto) {
    this.profileService.createProfile(createProfileDto);
  }

  @Post('/photo')
  addProfilePhoto(@Body() addProfilePhotoDto: AddProfilePhotoDto) {
    this.profileService.addPhotos();
  }

  @Put()
  editUserProfile(@Body() editProfileDto) {
    this.profileService.editProfile();
  }

  @Delete()
  deleteProfilePhoto() {
    this.profileService.deleteProfilePhoto();
  }
}
