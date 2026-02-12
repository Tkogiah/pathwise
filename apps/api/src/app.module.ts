import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';

@Module({
  imports: [PrismaModule, ClientsModule, RoadmapsModule],
  controllers: [AppController],
})
export class AppModule {}
