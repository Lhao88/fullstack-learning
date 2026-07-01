import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: {
            task: {},
          },
        },
        {
          provide: CategoryService,
          useValue: {
            existsForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
