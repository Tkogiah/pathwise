import { Module } from '@nestjs/common';
import { StageInstancesController } from './stage-instances.controller';
import { StageInstancesService } from './stage-instances.service';

@Module({
  controllers: [StageInstancesController],
  providers: [StageInstancesService],
})
export class StageInstancesModule {}
