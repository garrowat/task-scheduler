import { Module } from '@nestjs/common';
import { ScheduleService } from './schedules.service';
import { SchedulesController } from './schedules.controller';

@Module({
  controllers: [SchedulesController],
  providers: [ScheduleService],
})
export class SchedulesModule {}
