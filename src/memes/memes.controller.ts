import { Controller, Get } from '@nestjs/common';

import { MemesService } from './memes.service';

@Controller('memes')
export class MemesController {
  constructor(private readonly memesService: MemesService) {}

  @Get()
  getMemems() {}
}
