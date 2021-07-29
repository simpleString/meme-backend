import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { TagEntity } from './entities/tag.entity';
import { COUNT_OF_POPULAR_TAGS } from './tags.constants';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(TagEntity) private readonly _tagRepository: Repository<TagEntity>) {}

  // FIXME:: Needs werite to return popular tags. Right now its return just random tags.
  async getPopularTags(): Promise<TagEntity[]> {
    return this._tagRepository.find({ take: COUNT_OF_POPULAR_TAGS });
  }

  async getTagsByNames(search: string): Promise<TagEntity[]> {
    return this._tagRepository.find({ where: { name: Like(`*${search}*`) } });
  }
  async getTagsByIds(ids: string[]): Promise<TagEntity[]> {
    return this._tagRepository.findByIds(ids);
  }
}
