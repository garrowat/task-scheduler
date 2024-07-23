import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedules/schedules.service';
import { TaskService } from './tasks/tasks.service';
import { Task as TaskModel, Schedule as ScheduleModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly taskService: TaskService,
  ) {}
}
