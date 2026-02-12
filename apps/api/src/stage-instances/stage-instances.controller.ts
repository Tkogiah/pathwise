import {
  Controller,
  Patch,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { StageInstancesService } from './stage-instances.service';
import { UpdateHandoffSchema } from './dto/update-handoff.dto';

@Controller('stage-instances')
export class StageInstancesController {
  constructor(private stageInstancesService: StageInstancesService) {}

  @Patch(':id/handoff')
  async updateHandoff(@Param('id') id: string, @Body() body: unknown) {
    const result = UpdateHandoffSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.stageInstancesService.updateHandoff(id, result.data);
  }
}
