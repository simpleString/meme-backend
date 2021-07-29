import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { AttachmentType } from 'src/files/entities/file.entity';

// FIXME: This shit don't work. Needs fix!!!
export class AttachmentDto {
  type: AttachmentType;

  @ApiProperty({ description: 'If AttachmentType is id from system, pass it to content.' })
  @IsUUID()
  memeId?: string;
}

export class CreateMessageDto {
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  text: string;

  // @ValidateNested()
  // @IsDefined()
  // @IsNotEmptyObject()
  // @IsObject()
  // @Type(() => AttachmentDto)
  attachment?: AttachmentDto;

  @ApiProperty({ type: 'file', format: 'binary' })
  file?: Express.Multer.File;
}
