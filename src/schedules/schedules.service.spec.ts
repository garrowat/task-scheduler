import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesService } from './schedules.service';
import { PrismaService } from '../prisma.service';
import { Schedule } from '@prisma/client';
import { Prisma } from '@prisma/client';

describe('SchedulesService', () => {
  let service: SchedulesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulesService,
        {
          provide: PrismaService,
          useValue: {
            schedule: {
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

    service = module.get<SchedulesService>(SchedulesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('schedule', () => {
    it('should return a schedule by unique input', async () => {
      const expectedSchedule = {
        id: '1',
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      } as Schedule;
      jest
        .spyOn(prisma.schedule, 'findUnique')
        .mockResolvedValue(expectedSchedule);

      const result = await service.schedule({ id: '1' });
      expect(result).toEqual(expectedSchedule);
      expect(prisma.schedule.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('schedules', () => {
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
      jest
        .spyOn(prisma.schedule, 'findMany')
        .mockResolvedValue(expectedSchedules);

      const result = await service.schedules({});
      expect(result).toEqual(expectedSchedules);
      expect(prisma.schedule.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('createSchedule', () => {
    it('should create and return a new schedule', async () => {
      const createScheduleDto = {
        accountId: 1,
        agentId: 1,
        startTime: new Date(),
        endTime: new Date(),
      } as Prisma.ScheduleCreateInput;
      const expectedSchedule = { id: '1', ...createScheduleDto } as Schedule;
      jest.spyOn(prisma.schedule, 'create').mockResolvedValue(expectedSchedule);

      const result = await service.createSchedule(createScheduleDto);
      expect(result).toEqual(expectedSchedule);
      expect(prisma.schedule.create).toHaveBeenCalledWith({
        data: createScheduleDto,
      });
    });
  });

  describe('updateSchedule', () => {
    it('should update and return an existing schedule', async () => {
      const updateScheduleDto = {
        startTime: new Date(),
        endTime: new Date(),
      } as Prisma.ScheduleUpdateInput;
      const expectedSchedule = {
        id: '1',
        accountId: 1,
        agentId: 1,
        ...updateScheduleDto,
      } as Schedule;
      jest.spyOn(prisma.schedule, 'update').mockResolvedValue(expectedSchedule);

      const result = await service.updateSchedule({
        where: { id: '1' },
        data: updateScheduleDto,
      });
      expect(result).toEqual(expectedSchedule);
      expect(prisma.schedule.update).toHaveBeenCalledWith({
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
      jest.spyOn(prisma.schedule, 'delete').mockResolvedValue(expectedSchedule);

      const result = await service.deleteSchedule({ id: '1' });
      expect(result).toEqual(expectedSchedule);
      expect(prisma.schedule.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
