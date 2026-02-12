import {
  Controller,
  Patch,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { TaskInstancesService } from './task-instances.service';
import { UpdateTaskInstanceSchema } from './dto/update-task-instance.dto';

@Controller('task-instances')
export class TaskInstancesController {
  constructor(private taskInstancesService: TaskInstancesService) {}

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: unknown) {
    const result = UpdateTaskInstanceSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }

    return this.taskInstancesService.update(id, result.data);
  }
}
