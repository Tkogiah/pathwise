import { Controller, Get, Patch, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll() {
    return this.clientsService.findAll();
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

  @Patch(':id/archive')
  archive(@Param('id') id: string) {
    return this.clientsService.archive(id);
  }

  @Patch(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.clientsService.unarchive(id);
  }
}
