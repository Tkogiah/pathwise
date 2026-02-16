import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const clients = await this.prisma.client.findMany({
      where: { isArchived: false },
      orderBy: { lastName: 'asc' },
      select: { id: true, firstName: true, lastName: true },
    });
    return clients;
  }

  async findAllArchived() {
    const clients = await this.prisma.client.findMany({
      where: { isArchived: true },
      orderBy: { lastName: 'asc' },
      select: { id: true, firstName: true, lastName: true },
    });
    return clients;
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: {
        programInstances: {
          include: { template: { select: { name: true } } },
          orderBy: { startDate: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      isArchived: client.isArchived,
      roadmaps: client.programInstances.map((pi) => ({
        roadmapId: pi.id,
        templateName: pi.template.name,
        startDate: pi.startDate,
        isActive: pi.isActive,
      })),
    };
  }

  async archive(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }
    return this.prisma.client.update({
      where: { id },
      data: { isArchived: true },
      select: { id: true, isArchived: true },
    });
  }

  async unarchive(id: string) {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }
    return this.prisma.client.update({
      where: { id },
      data: { isArchived: false },
      select: { id: true, isArchived: true },
    });
  }
}
