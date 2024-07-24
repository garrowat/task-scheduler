import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Task, Prisma } from '@prisma/client';
@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async task(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });
  }

  async tasks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }): Promise<Task[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createTask(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    const startTime = new Date(data.startTime);
    const endTime = new Date(startTime.getTime() + data.duration * 60000); // Convert duration to milliseconds
    const conflict = await this.checkForConflict(
      data.scheduleId,
      startTime,
      endTime,
    );

    if (conflict) {
      throw new BadRequestException(
        'Task conflict detected. Cannot create task.',
      );
    }

    return this.prisma.task.create({ data });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { where, data } = params;
    return this.prisma.task.update({
      data,
      where,
    });
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    return this.prisma.task.delete({
      where,
    });
  }

  private async checkForConflict(
    scheduleId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflictingTasks = await this.prisma.task.findMany({
      where: {
        scheduleId,
        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

    return conflictingTasks.length > 0;
  }
}
