import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NoteLabel } from '@prisma/client';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findByTask(taskInstanceId: string) {
    const task = await this.prisma.taskInstance.findUnique({
      where: { id: taskInstanceId },
    });
    if (!task) {
      throw new NotFoundException(`Task instance ${taskInstanceId} not found`);
    }

    return this.prisma.taskNote.findMany({
      where: { taskInstanceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(taskInstanceId: string, dto: CreateNoteDto) {
    const task = await this.prisma.taskInstance.findUnique({
      where: { id: taskInstanceId },
    });
    if (!task) {
      throw new NotFoundException(`Task instance ${taskInstanceId} not found`);
    }

    return this.prisma.taskNote.create({
      data: {
        taskInstanceId,
        authorId: dto.authorId,
        label: (dto.label as NoteLabel) ?? undefined,
        summary: dto.summary ?? null,
        body: dto.body,
      },
    });
  }

  async update(noteId: string, dto: UpdateNoteDto) {
    const note = await this.prisma.taskNote.findUnique({
      where: { id: noteId },
    });
    if (!note) {
      throw new NotFoundException(`Note ${noteId} not found`);
    }

    if (dto.authorId !== note.authorId) {
      throw new ForbiddenException('Only the author can edit this note');
    }

    const updateData: Record<string, unknown> = {};
    if (dto.label !== undefined) updateData.label = dto.label;
    if (dto.summary !== undefined) updateData.summary = dto.summary;
    if (dto.body !== undefined) updateData.body = dto.body;

    return this.prisma.taskNote.update({
      where: { id: noteId },
      data: updateData,
    });
  }
}
