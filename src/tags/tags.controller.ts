import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiQuery({ name: 'ids', required: false })
  @ApiQuery({ name: 'search', required: false })
  getPopularTags(@Query('ids') ids: string[], @Query('search') search: string) {
    if (ids) return this.tagsService.getTagsByIds(ids);
    if (search) return this.tagsService.getTagsByNames(search);
    return this.tagsService.getPopularTags();
  }
}
