import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
    };
    category: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      category: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('创建管理员分类时要求所属用户存在', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.createCategory({
        userId: 'missing-user',
        name: '项目',
        color: 'blue',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('创建管理员分类时同一用户下分类名称不能重复', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
    prisma.category.findFirst.mockResolvedValue({ id: 'category-1' });

    await expect(
      service.createCategory({
        userId: 'user-1',
        name: '项目',
        color: 'blue',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
