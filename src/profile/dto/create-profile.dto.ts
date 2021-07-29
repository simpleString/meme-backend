import { Gender } from '../entities/userProfile.entity';

export class CreateProfileDto {
  name: string;
  age: number;
  userId: string;
  gender: Gender;
  bio: string;
}
