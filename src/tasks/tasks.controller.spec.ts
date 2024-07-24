import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from '@prisma/client';
import { Prisma } from '@prisma/client';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            task: jest.fn(),
            tasks: jest.fn(),
            createTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const expectedTask = {
        id: '1',
        scheduleId: '1',
        startTime: new Date(),
        duration: 60,
        type: 'work',
      } as Task;
      jest.spyOn(service, 'task').mockResolvedValue(expectedTask);

      const result = await controller.getTaskById('1');
      expect(result).toEqual(expectedTask);
      expect(service.task).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('getAllTasks', () => {
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
      jest.spyOn(service, 'tasks').mockResolvedValue(expectedTasks);

      const result = await controller.getAllTasks();
      expect(result).toEqual(expectedTasks);
      expect(service.tasks).toHaveBeenCalledWith({});
    });
  });

  describe('createTask', () => {
    it('should create and return a new task', async () => {
      const createTaskDto = {
        scheduleId: '1',
        startTime: new Date().toISOString(),
        duration: 60,
        type: 'work',
      } as unknown as Task;
      const expectedTask = { id: '1', ...createTaskDto } as Task;
      jest.spyOn(service, 'createTask').mockResolvedValue(expectedTask);

      const result = await controller.createTask(createTaskDto);
      expect(result).toEqual(expectedTask);
      expect(service.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('updateTask', () => {
    it('should update and return an existing task', async () => {
      const updateTaskDto = { duration: 45 } as Task;
      const expectedTask = {
        id: '1',
        scheduleId: '1',
        startTime: new Date(),
        duration: 45,
        type: 'work',
      } as Task;
      jest.spyOn(service, 'updateTask').mockResolvedValue(expectedTask);

      const result = await controller.updateTask('1', updateTaskDto);
      expect(result).toEqual(expectedTask);
      expect(service.updateTask).toHaveBeenCalledWith({
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
      jest.spyOn(service, 'deleteTask').mockResolvedValue(expectedTask);

      const result = await controller.deleteTask('1');
      expect(result).toEqual(expectedTask);
      expect(service.deleteTask).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
