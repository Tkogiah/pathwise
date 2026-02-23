import { Controller, Get } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { Public } from '../auth/public.decorator';

@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Public()
  @Get()
  findAll() {
    return this.templatesService.findAll();
  }
}
