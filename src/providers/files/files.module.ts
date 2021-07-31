import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FileEntity } from './entities/file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [TypeOrmModule.forFeature([FileEntity]), ConfigModule],
  exports: [FilesService],
})
export class FilesModule {}
