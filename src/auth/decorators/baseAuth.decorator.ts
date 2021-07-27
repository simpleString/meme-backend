import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

import { JwtAuthGuard } from '../guards/jwt.guard';

export function BaseAuth(tag: string) {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiTags(tag),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ type: ErrorResponseDto }),
  );
}
