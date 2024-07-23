import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules/schedules.controller';
import { TasksController } from './tasks/tasks.controller';
import { TasksModule } from './tasks/tasks.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [TasksModule, SchedulesModule],
  controllers: [TasksController, SchedulesController],
})
export class AppModule {}
