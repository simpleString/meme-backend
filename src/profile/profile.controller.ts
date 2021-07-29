import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { User } from 'src/auth/decorators/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

import { AddProfilePhotoDto } from './dto/add-profile-photo.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';

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

  @Post('/photo')
  @UseInterceptors(FilesInterceptor('files'))
  addProfilePhoto(
    @Body() addProfilePhotoDto: AddProfilePhotoDto,
    @Req() request: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // const busboy = new Busboy({ headers: request.headers });
    if (!files) throw new BadRequestException('Files not added.');
    return this.profileService.addPhotos(addProfilePhotoDto, files);
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
