import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { z } from 'zod';
import { ClientsService } from './clients.service';
import { Public } from '../auth/public.decorator';

const ActivateRoadmapSchema = z.object({
  templateId: z.string(),
});

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Public()
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Post()
  create(@Body() body: { firstName?: string; lastName?: string }) {
    return this.clientsService.create(body);
  }

  @Public()
  @Get('archived')
  findAllArchived() {
    return this.clientsService.findAllArchived();
  }

  @Public()
  @Get(':id/notes')
  findNotes(@Param('id') id: string, @Query('since') since?: string) {
    if (since && since !== '24h' && since !== '7d') {
      throw new BadRequestException({
        message: 'Invalid since parameter. Use 24h or 7d.',
      });
    }
    return this.clientsService.findNotesByClient(
      id,
      since as '24h' | '7d' | undefined,
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Public()
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
