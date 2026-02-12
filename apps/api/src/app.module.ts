import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { TaskInstancesModule } from './task-instances/task-instances.module';
import { StageInstancesModule } from './stage-instances/stage-instances.module';

@Module({
  imports: [
    PrismaModule,
    ClientsModule,
    RoadmapsModule,
    TaskInstancesModule,
    StageInstancesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
