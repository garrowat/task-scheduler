import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Schedule, Prisma } from '@prisma/client';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async schedule(
    scheduleWhereUniqueInput: Prisma.ScheduleWhereUniqueInput,
  ): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: scheduleWhereUniqueInput,
    });
  }

  async schedules(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ScheduleWhereUniqueInput;
    where?: Prisma.ScheduleWhereInput;
    orderBy?: Prisma.ScheduleOrderByWithRelationInput;
  }): Promise<Schedule[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.schedule.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createSchedule(data: Prisma.ScheduleCreateInput): Promise<Schedule> {
    return this.prisma.schedule.create({ data });
  }

  async updateSchedule(params: {
    where: Prisma.ScheduleWhereUniqueInput;
    data: Prisma.ScheduleUpdateInput;
  }): Promise<Schedule> {
    const { where, data } = params;
    return this.prisma.schedule.update({
      data,
      where,
    });
  }

  async deleteSchedule(
    where: Prisma.ScheduleWhereUniqueInput,
  ): Promise<Schedule> {
    return this.prisma.schedule.delete({
      where,
    });
  }
}
