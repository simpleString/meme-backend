import { IsUUID } from 'class-validator';
import { AttachmentType } from 'src/files/entities/attachment.entity';

export class CreateMessageDto {
  @IsUUID()
  userId: string;

  text: string;

  //   TODO:: Check validation unions and nested objs.
  attachment: {
    type: AttachmentType;
    content: string | Buffer;
  };
}
