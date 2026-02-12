import { Controller, Get, Param } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';

@Controller('roadmaps')
export class RoadmapsController {
  constructor(private roadmapsService: RoadmapsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roadmapsService.findOne(id);
  }
}
