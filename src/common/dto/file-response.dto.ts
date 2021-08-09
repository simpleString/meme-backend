import { LoadingStatus } from 'src/providers/files/entities/file.entity';

export class FileResponseDto {
  id: string;
  url: string;
  thumbnail_url: string;
  loadingStatus: LoadingStatus;
}
