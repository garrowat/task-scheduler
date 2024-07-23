import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedules.service';
import { Schedule as ScheduleModel } from '@prisma/client';

/**
 * A user should be able to:
 * - Create a schedule
 * - Retrieve all schedules
 * - Retrieve a single schedule
 * - Update a schedule
 * - Delete a schedule
 *
 */

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: ScheduleService) {}

  @Get('schedule/:id')
  async getScheduleById(@Param('id') id: string): Promise<ScheduleModel> {
    return this.schedulesService.schedule({ id: String(id) });
  }

  @Get('schedules')
  async getAllSchedules(): Promise<ScheduleModel[]> {
    return this.schedulesService.schedules({});
  }

  @Get('filtered-schedules/:startTime/:endTime')
  async getFilteredSchedules(
    @Param('startTime') startTime: string,
    @Param('endTime') endTime: string,
  ): Promise<ScheduleModel[]> {
    return this.schedulesService.schedules({
      where: {
        AND: [
          { startTime: { gte: new Date(startTime) } },
          { endTime: { lte: new Date(endTime) } },
        ],
      },
    });
  }

  @Post('schedule')
  async createSchedule(@Body() data: ScheduleModel): Promise<ScheduleModel> {
    return this.schedulesService.createSchedule(data);
  }

  @Patch('schedule/:id')
  async updateSchedule(
    @Param('id') id: string,
    @Body() data: ScheduleModel,
  ): Promise<ScheduleModel> {
    return this.schedulesService.updateSchedule({
      where: { id: String(id) },
      data,
    });
  }

  @Delete('schedule/:id')
  async deleteSchedule(@Param('id') id: string): Promise<ScheduleModel> {
    return this.schedulesService.deleteSchedule({ id: String(id) });
  }
}
