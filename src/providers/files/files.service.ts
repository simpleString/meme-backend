import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import Axios from 'axios';
import * as cloneable from 'cloneable-readable';
import * as FormData from 'form-data';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { AttachmentType, FileEntity } from './entities/file.entity';
import { THUMBNAIL_PREFIX } from './files.constants';

@Injectable()
export class FilesService {
  private s3: S3;

  constructor(
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.s3 = new S3({
      endpoint: 'http://localhost:9000',
      s3ForcePathStyle: true,
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  public async createAttachment(attachmentType: AttachmentType, file: Buffer, mimeType: string, fileName: string) {
    const folderName = this.getFolderNameByAttachmentType(attachmentType);
    const fileExtension = fileName.split('.').pop();
    const newName = folderName + '/' + uuid() + '.' + fileExtension;
    const result = await this.uploadFile(folderName, file, mimeType, newName);
    const fileEntity = this.fileRepository.create({ key: result.Key, type: attachmentType });
    await this.fileRepository.save(fileEntity);
    return fileEntity;
  }

  public async createAttachmentStream(attachmentType: AttachmentType, file: NodeJS.ReadableStream) {
    const folderName = this.getFolderNameByAttachmentType(attachmentType);
    const fileName = uuid();
    const fileNameInBucket = folderName + '/' + fileName + '.' + 'jpeg';
    // const newStream = file.pipe(sharp().jpeg());
    try {
      const stream = cloneable(file as any);
      const result = await Promise.all([
        this.uploadFromStreamToBucket(fileNameInBucket, stream.pipe(sharp().jpeg())),
        this.uploadFromStreamToBucket(
          THUMBNAIL_PREFIX + fileNameInBucket,
          stream.clone().pipe(sharp().resize(200).jpeg({ quality: 100 })),
        ),
      ]);
      const fileEntity = this.fileRepository.create({ key: fileName, type: attachmentType });
      await this.fileRepository.save(fileEntity);
      return fileEntity;
    } catch (error) {
      console.log(error);
    }
  }

  private uploadFromStream(mimeType: string, name: string, pass: NodeJS.ReadableStream) {
    const formData = new FormData();
    formData.append('file', pass);
    formData.append('id', name);
    // const formLength = promisify(formData.getLength)();
    // console.log(formData.getHeaders()['content-type']);
    const headers = formData.getHeaders();
    // const  data = request({
    //   host: 'http://localhost:3001',
    //   // port: '3001'
    //   path: '',
    //   method: 'POST',
    //   headers: formData.getHeaders(),
    // })
    // pass.pipe(data)
    const data = Axios.post('http://localhost:3001', formData, { headers });
    // const data = this.httpService.post('http://localhost:3001', formData, { headers: headers }).toPromise();
    return data;
  }

  private uploadFromStreamToBucket(name: string, file: NodeJS.ReadableStream) {
    const params: S3.Types.PutObjectRequest = {
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: name,
      Body: file,
      ContentType: 'image/jpeg',
    };
    // return Promise.all([
    //   new Promise((resolse, reject) => {
    //     file.on('end', () => {
    //       resolse;
    //     });
    //   }),
    //   this.s3.upload(params).promise(),
    // ]);
    return this.s3.upload(params).promise();
  }

  private getFolderNameByAttachmentType(attachmentType: AttachmentType): string {
    switch (attachmentType) {
      case AttachmentType.Meme:
        return this.configService.get('AWS_MEME_FOLDER');
      case AttachmentType.Photo:
        return this.configService.get('AWS_PHOTO_FOLDER');
    }
  }

  public async generateFileUrlById(fileId: string) {
    const file = await this.fileRepository.findOne(fileId);
    if (!file) throw new NotFoundException('File not found.');
    return await Promise.all([
      this.generateFileUrl(
        this.configService.get('AWS_BUCKET'),
        this.getFolderNameByAttachmentType(file.type) + '/' + file.key + '.jpeg',
      ),
      this.generateFileUrl(
        this.configService.get('AWS_BUCKET'),
        THUMBNAIL_PREFIX + this.getFolderNameByAttachmentType(file.type) + '/' + file.key + '.jpeg',
      ),
    ]);
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
