import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Req } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { Request } from 'express';
import { BaseAuth } from 'src/auth/decorators/baseAuth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { IFileStream } from 'src/providers/files/files.enterfaces';
import { UserEntity } from 'src/users/entities/user.entity';

import { AddProfilePhotoDto } from './dto/add-profile-photo.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EditProfilePhotoDto } from './dto/edit-profile-photo.dto';
import { ProfileService } from './profile.service';

const Busboy = require('busboy');
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
  @ApiConsumes('multipart/form-data')
  async addProfilePhoto(@Body() addProfilePhotoDto: AddProfilePhotoDto, @Req() request: Request) {
    const busboy = new Busboy({ headers: request.headers });
    return new Promise((resolve) => {
      const result: Promise<ManagedUpload.SendData>[] = [];
      busboy.on('file', async (fieldName, file, fileName, encoding, mimeType) => {
        if (fieldName === 'files') {
          console.log(fieldName, file, fileName, encoding, mimeType);
          const fileData: IFileStream = { fieldName, file, fileName, encoding, mimeType };

          result.push(this.profileService.addPhoto(addProfilePhotoDto, fileData));
        }
        file.resume();
      });
      busboy.on('finish', async () => {
        resolve(Promise.all(result));
      });

      request.pipe(busboy);
    });
  }

  @Put()
  editUserProfile(@Body() editProfilePhotoDto: EditProfilePhotoDto) {
    this.profileService.editProfile();
  }

  @Delete()
  deleteProfilePhoto(@Body() editProfilePhotoDto: EditProfilePhotoDto) {
    this.profileService.deleteProfilePhoto();
  }
}
