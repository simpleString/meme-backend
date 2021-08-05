import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, Req } from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import * as Busboy from 'busboy';
import { Request } from 'express';
import { User } from 'src/auth/decorators/user.decorator';
import { FileResponseDto } from 'src/common/dto/file-response.dto';
import { IFileStream } from 'src/providers/files/files.enterfaces';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EditProfileDto } from './dto/edit-profile-photo.dto';
import { ProfileService } from './profile.service';

// const Busboy = require('busboy');
@Controller('profile')
// @BaseAuth('profile')
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

  @Post('/:userId/photo')
  @ApiConsumes('multipart/form-data')
  async addProfilePhoto(@Param('userId', ParseUUIDPipe) userId: string, @Req() request: Request) {
    const busboy = new Busboy({ headers: request.headers });
    return new Promise((resolve) => {
      const result: Promise<FileResponseDto>[] = [];
      busboy.on('file', async (fieldName, file, fileName, encoding, mimeType) => {
        if (fieldName === 'files') {
          console.log(fieldName, file, fileName, encoding, mimeType);
          const fileData: IFileStream = { fieldName, file, fileName, encoding, mimeType };

          result.push(this.profileService.addPhoto(userId, fileData));
        }
        file.resume();
      });
      busboy.on('finish', async () => {
        resolve(Promise.all(result));
      });

      request.pipe(busboy);
    });
  }

  @Put('/:userId')
  editUserProfile(@Param('userId', ParseUUIDPipe) userId: string, @Body() editProfileDto: EditProfileDto) {
    this.profileService.editProfile(editProfileDto, userId);
  }

  // @Delete()
  // deleteProfilePhoto(@Body() editProfilePhotoDto: EditProfilePhotoDto) {
  //   this.profileService.deleteProfilePhoto();
  // }
}
function addProfilePhotoDto(addProfilePhotoDto: any, fileData: IFileStream): Promise<ManagedUpload.SendData> {
  throw new Error('Function not implemented.');
}
