import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [TasksModule, SchedulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
