import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category/category.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let prisma: {
    task: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };
  let categoryService: {
    existsForUser: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };
    categoryService = {
      existsForUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: CategoryService,
          useValue: categoryService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('查询任务列表时只查询当前用户的任务', async () => {
    prisma.task.findMany.mockResolvedValue([]);

    await service.findAll('user-1');

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        category: true,
      },
    });
  });

  it('查询其他用户任务时按任务不存在处理', async () => {
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(service.findOne('task-1', 'user-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(prisma.task.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'task-1',
        userId: 'user-1',
      },
      include: {
        category: true,
      },
    });
  });

  it('更新任务前必须确认任务属于当前用户', async () => {
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(
      service.update('task-1', { title: '新标题' }, 'user-1'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.task.update).not.toHaveBeenCalled();
  });

  it('删除任务前必须确认任务属于当前用户', async () => {
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(service.remove('task-1', 'user-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(prisma.task.delete).not.toHaveBeenCalled();
  });

  it('状态流转前必须确认任务属于当前用户', async () => {
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(
      service.changeToNextStatus('task-1', 'user-1'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.task.update).not.toHaveBeenCalled();
  });

  it('创建任务时不能使用其他用户的分类', async () => {
    categoryService.existsForUser.mockResolvedValue(false);

    await expect(
      service.create(
        {
          title: '任务',
          description: '任务描述',
          level: 'high',
          categoryId: 'category-1',
        },
        'user-1',
      ),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(categoryService.existsForUser).toHaveBeenCalledWith(
      'category-1',
      'user-1',
    );
    expect(prisma.task.create).not.toHaveBeenCalled();
  });
});
