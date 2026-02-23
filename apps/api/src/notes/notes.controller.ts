import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteSchema } from './dto/create-note.dto';
import { UpdateNoteSchema } from './dto/update-note.dto';
import { Public } from '../auth/public.decorator';

@Controller()
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Public()
  @Get('task-instances/:taskId/notes')
  async findByTask(@Param('taskId') taskId: string) {
    return this.notesService.findByTask(taskId);
  }

  @Post('task-instances/:taskId/notes')
  async create(@Param('taskId') taskId: string, @Body() body: unknown) {
    const result = CreateNoteSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }
    return this.notesService.create(taskId, result.data);
  }

  @Patch('notes/:id')
  async update(@Param('id') id: string, @Body() body: unknown) {
    const result = UpdateNoteSchema.safeParse(body);
    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }
    return this.notesService.update(id, result.data);
  }
}
