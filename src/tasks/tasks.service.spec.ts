import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';
import { Task } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('task', () => {
    it('should return a task by unique input', async () => {
      const expectedTask = {
        id: '1',
        scheduleId: '1',
        startTime: new Date(),
        duration: 60,
        type: 'work',
      } as Task;
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(expectedTask);

      const result = await service.task({ id: '1' });
      expect(result).toEqual(expectedTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('tasks', () => {
    it('should return an array of tasks', async () => {
      const expectedTasks = [
        {
          id: '1',
          scheduleId: '1',
          startTime: new Date(),
          duration: 60,
          type: 'work',
        },
        {
          id: '2',
          scheduleId: '2',
          startTime: new Date(),
          duration: 30,
          type: 'break',
        },
      ] as Task[];
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue(expectedTasks);

      const result = await service.tasks({});
      expect(result).toEqual(expectedTasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('createTask', () => {
    it('should create and return a new task if no conflict exists', async () => {
      const createTaskDto = {
        scheduleId: '1',
        startTime: new Date().toISOString(),
        duration: 60,
        type: 'work',
      } as Prisma.TaskUncheckedCreateInput;
      const expectedTask = { id: '1', ...createTaskDto } as Task;
      jest.spyOn(prisma.task, 'create').mockResolvedValue(expectedTask);
      jest.spyOn(service, <any>'checkForConflict').mockResolvedValue(false);

      const result = await service.createTask(createTaskDto);
      expect(result).toEqual(expectedTask);
      expect(prisma.task.create).toHaveBeenCalledWith({ data: createTaskDto });
      // String index notation is used to access private method, see: https://github.com/microsoft/TypeScript/issues/19335#issuecomment-338003928
      expect(service['checkForConflict']).toHaveBeenCalledWith(
        createTaskDto.scheduleId,
        new Date(createTaskDto.startTime),
        new Date(
          new Date(createTaskDto.startTime).getTime() +
            createTaskDto.duration * 60000,
        ),
      );
    });

    it('should throw a BadRequestException if a conflict exists', async () => {
      const createTaskDto = {
        scheduleId: '1',
        startTime: new Date().toISOString(),
        duration: 60,
        type: 'work',
      } as Prisma.TaskUncheckedCreateInput;
      jest.spyOn(service, <any>'checkForConflict').mockResolvedValue(true);

      await expect(service.createTask(createTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateTask', () => {
    it('should update and return an existing task', async () => {
      const updateTaskDto = { duration: 45 } as Prisma.TaskUpdateInput;
      const expectedTask = {
        id: '1',
        scheduleId: '1',
        startTime: new Date(),
        duration: 45,
        type: 'work',
      } as Task;
      jest.spyOn(prisma.task, 'update').mockResolvedValue(expectedTask);

      const result = await service.updateTask({
        where: { id: '1' },
        data: updateTaskDto,
      });
      expect(result).toEqual(expectedTask);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateTaskDto,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete and return an existing task', async () => {
      const expectedTask = {
        id: '1',
        scheduleId: '1',
        startTime: new Date(),
        duration: 60,
        type: 'work',
      } as Task;
      jest.spyOn(prisma.task, 'delete').mockResolvedValue(expectedTask);

      const result = await service.deleteTask({ id: '1' });
      expect(result).toEqual(expectedTask);
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });

  describe('checkForConflict', () => {
    it('should return true if a conflict exists', async () => {
      const scheduleId = '1';
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60000);
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue([
        {
          id: '1',
          scheduleId,
          startTime,
          endTime,
          duration: 60,
          type: 'work',
        } as Task,
      ]);

      const result = await service['checkForConflict'](
        scheduleId,
        startTime,
        endTime,
      );
      expect(result).toBe(true);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          scheduleId,
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      });
    });

    it('should return false if no conflict exists', async () => {
      const scheduleId = '1';
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60000);
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue([]);

      const result = await service['checkForConflict'](
        scheduleId,
        startTime,
        endTime,
      );
      expect(result).toBe(false);
      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: {
          scheduleId,
          AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
        },
      });
    });
  });
});
