import { LoadingStatus } from 'src/files/entities/file.entity';

export class ResponseProfileDto {
  id: string;
  name: string;
  age: number;
  distance: number;
  commonTags?: [
    {
      id: string;
      name: string;
    },
  ];
  photos: {
    id: string;
    loadingStatus: LoadingStatus;
    url: string;
    urlLowQuality: string;
  }[];
  bio: string;
  isOnline: boolean;
}
