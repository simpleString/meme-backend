import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { AttachmentType, FileEntity } from './entities/file.entity';

@Injectable()
export class FilesService {
  private s3: S3;

  constructor(
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3({ endpoint: 'http://localhost:9000' });
  }

  public async createAttachment(attachmentType: AttachmentType, file: Buffer, mimeType: string, fileName: string) {
    const bucketName = this.getBucketNameByAttachmentType(attachmentType);
    const fileExtension = fileName.split('.').pop();
    const newName = uuid() + '.' + fileExtension;
    const result = await this.uploadFile(bucketName, file, mimeType, newName);
    const fileEntity = this.fileRepository.create({ key: result.Key, type: attachmentType });
    await this.fileRepository.save(fileEntity);
    return fileEntity;
  }

  private getBucketNameByAttachmentType(attachmentType: AttachmentType): string {
    switch (attachmentType) {
      case AttachmentType.Meme:
        return this.configService.get('AWS_MEME_BUCKET');
      case AttachmentType.Photo:
        return this.configService.get('AWS_PHOTO_BUCKET');
    }
  }

  public async generateFileUrlById(fileId: string) {
    const file = await this.fileRepository.findOne(fileId);
    if (!file) throw new NotFoundException('File not found.');
    return await this.generateFileUrl(this.getBucketNameByAttachmentType(file.type), file.key);
  }

  private async generateFileUrl(bucket: string, key: string) {
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
