import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttachmentType } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

import { AddProfilePhotoDto } from './dto/add-profile-photo.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ResponseProfileDto } from './dto/response-profile.dto';
import { UserProfileEntity } from './entities/userProfile.entity';

@Injectable()
export class ProfileService {
  deleteProfilePhoto() {
    throw new Error('Method not implemented.');
  }
  editProfile() {
    throw new Error('Method not implemented.');
  }
  async addPhotos(addProfilePhotoDto: AddProfilePhotoDto, busboy: Array<Express.Multer.File>) {
    return await Promise.all(
      busboy.map(async (file) => {
        const contents = await this._filesService.createAttachmentStream(
          AttachmentType.Photo,
          file,
          file.mimetype,
          file.originalname,
        );
        console.log(contents);
        return contents;
      }),
    );
    busboy.forEach(async (file) => {
      console.log(file);
      return await this._filesService.createAttachmentStream(
        AttachmentType.Photo,
        file,
        file.mimetype,
        file.originalname,
      );
    });
  }
  constructor(
    @InjectRepository(UserProfileEntity) private readonly _userProfileRepository: Repository<UserProfileEntity>,
    private readonly _usersService: UsersService,
    private readonly _filesService: FilesService,
  ) {}

  async getUserInfo(userId: string): Promise<ResponseProfileDto> {
    const userProfile = await this._userProfileRepository.findOne({
      where: { userId },
      relations: ['photos', 'photos.content'],
    });
    if (!userProfile) throw new NotFoundException('User profile not found.');
    const isUserOnline = await this._usersService.isUserOnline(userProfile.userId);
    const responseProfileDto: ResponseProfileDto = {
      id: userProfile.userId,
      age: userProfile.age,
      bio: userProfile.bio,
      isOnline: isUserOnline,
      name: userProfile.name,
      photos: userProfile.photos.map((photo) => {
        return {
          id: photo.id,
          loadingStatus: photo.loadingStatus,
          url: 'fsd',
          urlLowQuality: 'fds',
        };
      }),
      distance: 1,
    };
    return responseProfileDto;
  }

  async createProfile(createProfileDto: CreateProfileDto): Promise<UserProfileEntity> {
    const profile = this._userProfileRepository.create(createProfileDto);
    await this._userProfileRepository.save(profile);
    return profile;
  }
}
