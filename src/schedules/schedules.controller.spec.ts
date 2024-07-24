import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';
import { Schedule } from '@prisma/client';

describe('SchedulesController', () => {
  let controller: SchedulesController;
  let service: SchedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        {
          provide: SchedulesService,
          useValue: {
            schedule: jest.fn(),
            schedules: jest.fn(),
            createSchedule: jest.fn(),
            updateSchedule: jest.fn(),
            deleteSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
    service = module.get<SchedulesService>(SchedulesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getScheduleById', () => {
    it('should return a schedule by ID', async () => {
      const expectedSchedule = {
        id: '1',
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      } as Schedule;
      jest.spyOn(service, 'schedule').mockResolvedValue(expectedSchedule);

      const result = await controller.getScheduleById('1');
      expect(result).toEqual(expectedSchedule);
      expect(service.schedule).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('getAllSchedules', () => {
    it('should return an array of schedules', async () => {
      const expectedSchedules = [
        {
          id: '1',
          accountId: 1,
          agentId: 1,
          startTime: new Date(),
          endTime: new Date(),
        },
        {
          id: '2',
          accountId: 2,
          agentId: 2,
          startTime: new Date(),
          endTime: new Date(),
        },
      ] as Schedule[];
      jest.spyOn(service, 'schedules').mockResolvedValue(expectedSchedules);

      const result = await controller.getAllSchedules();
      expect(result).toEqual(expectedSchedules);
      expect(service.schedules).toHaveBeenCalledWith({});
    });
  });

  describe('getFilteredSchedules', () => {
    it('should return filtered schedules', async () => {
      const expectedSchedules = [
        {
          id: '1',
          accountId: 1,
          agentId: 1,
          startTime: new Date('2024-07-23T10:00:00Z'),
          endTime: new Date('2024-07-23T12:00:00Z'),
        },
      ] as Schedule[];
      jest.spyOn(service, 'schedules').mockResolvedValue(expectedSchedules);

      const result = await controller.getFilteredSchedules(
        '2024-07-23T10:00:00Z',
        '2024-07-23T12:00:00Z',
      );
      expect(result).toEqual(expectedSchedules);
      expect(service.schedules).toHaveBeenCalledWith({
        where: {
          AND: [
            { startTime: { gte: new Date('2024-07-23T10:00:00Z') } },
            { endTime: { lte: new Date('2024-07-23T12:00:00Z') } },
          ],
        },
      });
    });
  });

  describe('createSchedule', () => {
    it('should create and return a new schedule', async () => {
      const createScheduleDto = {
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      } as Schedule;
      const expectedSchedule = { id: '1', ...createScheduleDto } as Schedule;
      jest.spyOn(service, 'createSchedule').mockResolvedValue(expectedSchedule);

      const result = await controller.createSchedule(createScheduleDto);
      expect(result).toEqual(expectedSchedule);
      expect(service.createSchedule).toHaveBeenCalledWith(createScheduleDto);
    });
  });

  describe('updateSchedule', () => {
    it('should update and return an existing schedule', async () => {
      const updateScheduleDto = {
        startTime: new Date(),
        endTime: new Date(),
      } as Schedule;
      const expectedSchedule = {
        id: '1',
        accountId: 1,
        agentId: 1,
        ...updateScheduleDto,
      } as Schedule;
      jest.spyOn(service, 'updateSchedule').mockResolvedValue(expectedSchedule);

      const result = await controller.updateSchedule('1', updateScheduleDto);
      expect(result).toEqual(expectedSchedule);
      expect(service.updateSchedule).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateScheduleDto,
      });
    });
  });

  describe('deleteSchedule', () => {
    it('should delete and return an existing schedule', async () => {
      const expectedSchedule = {
        id: '1',
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      } as Schedule;
      jest.spyOn(service, 'deleteSchedule').mockResolvedValue(expectedSchedule);

      const result = await controller.deleteSchedule('1');
      expect(result).toEqual(expectedSchedule);
      expect(service.deleteSchedule).toHaveBeenCalledWith({ id: '1' });
    });
  });
});
