import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { AttachmentEntity, AttachmentType } from './entities/attachment.entity';
import { FileEntity } from './entities/file.entity';

@Injectable()
export class FilesService {
  private s3: S3;

  constructor(
    @InjectRepository(AttachmentEntity) private readonly attachmentRepository: Repository<AttachmentEntity>,
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3();
  }

  public async createAttachment(attachmentType: AttachmentType, file: Buffer, mimeType: string, fileName: string) {
    let bucketName: string;
    switch (attachmentType) {
      case AttachmentType.Meme:
        bucketName = this.configService.get('AWS_MEME_BUCKET');
        break;
      case AttachmentType.Photo:
        bucketName = this.configService.get('AWS_PHOTO_BUCKET');
        break;
    }
    const fileExtension = fileName.split('.').pop();
    const newName = uuid() + '.' + fileExtension;
    const result = await this.uploadFile(bucketName, file, mimeType, newName);
    const fileEntity = this.fileRepository.create({ key: result.Key });
    await this.fileRepository.save(fileEntity);
    const attachment = this.attachmentRepository.create({ content: fileEntity, type: attachmentType });
    await this.attachmentRepository.save(attachment);
    return attachment;
  }

  private async downloadFile(bucket: string, key: string) {
    const fileUrl = await this.s3.getSignedUrlPromise('getObject', { Key: key, Bucket: bucket });
    return fileUrl;
  }

  private async uploadFile(bucket: string, file: Buffer, mimeType: string, name: string) {
    const uploadResult = this.s3
      .upload({
        Bucket: bucket,
        Body: file,
        Key: name,
        ContentType: mimeType,
      })
      .promise();
    return uploadResult;
  }
}
