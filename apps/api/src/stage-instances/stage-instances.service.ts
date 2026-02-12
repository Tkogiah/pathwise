import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHandoffDto } from './dto/update-handoff.dto';
import { Prisma } from '@prisma/client';

type StageInstanceRecord = Prisma.StageInstanceGetPayload<{
  select: { id: true };
}>;

@Injectable()
export class StageInstancesService {
  constructor(private prisma: PrismaService) {}

  async updateHandoff(id: string, dto: UpdateHandoffDto) {
    const stage: StageInstanceRecord | null =
      await this.prisma.stageInstance.findUnique({
        where: { id },
        select: { id: true },
      });

    if (!stage) {
      throw new NotFoundException(`Stage instance ${id} not found`);
    }

    return this.prisma.stageInstance.update({
      where: { id },
      data: { handoffSummary: dto.handoffSummary || null },
    });
  }
}
