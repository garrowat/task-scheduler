import { Controller } from '@nestjs/common';
import { SchedulesService } from './schedules/schedules.service';
import { TasksService } from './tasks/tasks.service';

@Controller()
export class AppController {
  constructor(
    private readonly scheduleService: SchedulesService,
    private readonly taskService: TasksService,
  ) {}
}
