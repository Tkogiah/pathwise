import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { RoadmapsModule } from './roadmaps/roadmaps.module';
import { TaskInstancesModule } from './task-instances/task-instances.module';
import { StageInstancesModule } from './stage-instances/stage-instances.module';
import { TemplatesModule } from './templates/templates.module';
import { NotesModule } from './notes/notes.module';
import { DigestModule } from './digest/digest.module';
import { SlackModule } from './integrations/slack/slack.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ClientsModule,
    RoadmapsModule,
    TaskInstancesModule,
    StageInstancesModule,
    TemplatesModule,
    NotesModule,
    DigestModule,
    SlackModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
