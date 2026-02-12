import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const clients = await this.prisma.client.findMany({
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
      roadmaps: client.programInstances.map((pi) => ({
        roadmapId: pi.id,
        templateName: pi.template.name,
        startDate: pi.startDate,
        isActive: pi.isActive,
      })),
    };
  }
}
