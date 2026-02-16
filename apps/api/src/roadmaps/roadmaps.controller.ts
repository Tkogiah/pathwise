import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { UpdateRoadmapSchema } from './dto/update-roadmap.dto';

@Controller('roadmaps')
export class RoadmapsController {
  constructor(private roadmapsService: RoadmapsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roadmapsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const result = UpdateRoadmapSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }
    return this.roadmapsService.update(id, result.data);
  }
}
