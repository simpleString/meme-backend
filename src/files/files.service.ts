import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import stream, { PassThrough, Readable } from 'stream';
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
    this.s3 = new S3({ endpoint: 'http://localhost:9000', s3ForcePathStyle: true });
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

  public async createAttachmentStream(
    attachmentType: AttachmentType,
    file: Express.Multer.File,
    mimeType: string,
    fileName: string,
  ) {
    const bucketName = this.getBucketNameByAttachmentType(attachmentType);

    const fileExtension = fileName.split('.').pop();
    const newName = uuid() + '.' + fileExtension;

    const fileStream = Readable.from(file.buffer);

    console.log(newName);

    const { result, writeStream } = this.uploadFromStream(bucketName, mimeType, newName);
    console.log(result, writeStream);

    const pipeLine = fileStream.pipe(writeStream);
    let recivedData: S3.ManagedUpload.SendData;
    try {
      recivedData = await result;
      // const fileEntity = this.fileRepository.create({ key: recivedData.Key, type: attachmentType });
      // await this.fileRepository.save(fileEntity);
      // return fileEntity;
      return recivedData;
    } catch (error) {
      console.log(error);

      recivedData = error;
      return recivedData;
    }
    console.log(result, recivedData);

    // const end = await new Promise((resolve, reject) => {
    //   fileStream.pipe(this.uploadFromStream(bucketName, mimeType, newName)).on('close', (param) => resolve());
    //   // file.stream.on('error' () => reject())
    // });
    // const result = await this.uploadFromStream(bucketName, mimeType, newName);
  }

  // private uploadStream ({ bucket, key }) {
  //   const s3 = new AWS.S3();
  //   const pass = new stream.PassThrough();
  //   return {
  //     writeStream: pass,
  //     promise: s3.upload({ Bucket, Key, Body: pass }).promise(),
  //   };
  // }

  private uploadFromStream(bucket: string, mimeType: string, name: string) {
    var pass = new PassThrough();

    var params: S3.Types.PutObjectRequest = { Bucket: bucket, Key: name, Body: pass, ContentType: mimeType };
    return {
      result: this.s3.upload(params).promise(),
      writeStream: pass,
    };
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
