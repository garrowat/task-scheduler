import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { SchedulesModule } from './schedules/schedules.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [TasksModule, SchedulesModule],
  providers: [PrismaService],
})
export class AppModule {}
