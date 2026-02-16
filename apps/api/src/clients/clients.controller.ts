import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ClientsService } from './clients.service';

const ActivateRoadmapSchema = z.object({
  templateId: z.string(),
});

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Post()
  create(@Body() body: { firstName?: string; lastName?: string }) {
    return this.clientsService.create(body);
  }

  @Get('archived')
  findAllArchived() {
    return this.clientsService.findAllArchived();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Get(':id/roadmaps')
  findRoadmaps(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post(':id/roadmaps')
  activateRoadmap(@Param('id') id: string, @Body() body: unknown) {
    const result = ActivateRoadmapSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }
    return this.clientsService.activateRoadmap(id, result.data.templateId);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.clientsService.archive(id);
  }

  @Patch(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.clientsService.unarchive(id);
  }
}
