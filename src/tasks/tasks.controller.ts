import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task as TaskModel } from '@prisma/client';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks/:id')
  async getTaskById(@Param('id') id: string): Promise<TaskModel> {
    return this.tasksService.task({ id: String(id) });
  }

  @Get('tasks')
  async getAllTasks(): Promise<TaskModel[]> {
    return this.tasksService.tasks({});
  }

  @Post('tasks')
  async createTask(@Body() data: TaskModel): Promise<TaskModel> {
    return this.tasksService.createTask(data);
  }

  @Patch('tasks/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() data: TaskModel,
  ): Promise<TaskModel> {
    return this.tasksService.updateTask({
      where: { id: String(id) },
      data,
    });
  }

  @Delete('tasks/:id')
  async deleteTask(@Param('id') id: string): Promise<TaskModel> {
    return this.tasksService.deleteTask({ id: String(id) });
  }
}
