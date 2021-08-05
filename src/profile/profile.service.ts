import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileResponseDto } from 'src/common/dto/file-response.dto';
import { AttachmentType } from 'src/providers/files/entities/file.entity';
import { IFileStream } from 'src/providers/files/files.enterfaces';
import { FilesService } from 'src/providers/files/files.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { EditProfileDto } from './dto/edit-profile-photo.dto';
import { ResponseProfileDto } from './dto/response-profile.dto';
import { UserProfileEntity } from './entities/userProfile.entity';

@Injectable()
export class ProfileService {
  deleteProfilePhoto() {
    throw new Error('Method not implemented.');
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

  async editProfile(editProfileDto: EditProfileDto, userId: string) {
    const updateQuery = await this._userProfileRepository.update(userId, editProfileDto);
  }

  async addPhoto(userId: string, file: IFileStream): Promise<FileResponseDto> {
    const content = await this._filesService.createAttachmentStream(AttachmentType.Photo, file.file);
    const urls = await this._filesService.generateFileUrlById(content.id);
    const result: FileResponseDto = { id: content.id, url: urls[0], thumbnail_url: urls[1] };
    return result;
  }
}
