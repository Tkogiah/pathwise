import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { SlackService } from './slack.service';
import { CreateExtractionSchema } from './dto/create-extraction.dto';
import { Public } from '../../auth/public.decorator';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Public()
@UseGuards(ApiKeyGuard)
@Controller('integrations/slack')
export class SlackController {
  constructor(private slackService: SlackService) {}

  @Post('extractions')
  async createDraft(@Body() body: unknown) {
    const result = CreateExtractionSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }
    return this.slackService.createDraft(result.data);
  }

  @Patch('extractions/:id/approve')
  async approve(@Param('id') id: string) {
    return this.slackService.approve(id);
  }

  @Patch('extractions/:id/reject')
  async reject(@Param('id') id: string) {
    return this.slackService.reject(id);
  }
}
