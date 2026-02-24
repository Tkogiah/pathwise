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

  private async attachAuthorNames(
    notes: { authorId: string }[],
  ): Promise<Record<string, string | null>> {
    const authorIds = Array.from(new Set(notes.map((n) => n.authorId)));
    if (authorIds.length === 0) return {};

    const users = await this.prisma.user.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, name: true },
    });
    return users.reduce<Record<string, string | null>>((acc, user) => {
      acc[user.id] = user.name;
      return acc;
    }, {});
  }

  async findByTask(taskInstanceId: string) {
    const task = await this.prisma.taskInstance.findUnique({
      where: { id: taskInstanceId },
    });
    if (!task) {
      throw new NotFoundException(`Task instance ${taskInstanceId} not found`);
    }

    const notes = await this.prisma.taskNote.findMany({
      where: { taskInstanceId },
      orderBy: { createdAt: 'desc' },
    });
    const authorMap = await this.attachAuthorNames(notes);
    return notes.map((note) => ({
      ...note,
      authorName: authorMap[note.authorId] ?? null,
    }));
  }

  async create(taskInstanceId: string, dto: CreateNoteDto) {
    const task = await this.prisma.taskInstance.findUnique({
      where: { id: taskInstanceId },
    });
    if (!task) {
      throw new NotFoundException(`Task instance ${taskInstanceId} not found`);
    }

    const note = await this.prisma.taskNote.create({
      data: {
        taskInstanceId,
        authorId: dto.authorId,
        label: (dto.label as NoteLabel) ?? undefined,
        summary: dto.summary ?? null,
        body: dto.body,
      },
    });
    const authorMap = await this.attachAuthorNames([note]);
    return { ...note, authorName: authorMap[note.authorId] ?? null };
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

    const updated = await this.prisma.taskNote.update({
      where: { id: noteId },
      data: updateData,
    });
    const authorMap = await this.attachAuthorNames([updated]);
    return { ...updated, authorName: authorMap[updated.authorId] ?? null };
  }
}
