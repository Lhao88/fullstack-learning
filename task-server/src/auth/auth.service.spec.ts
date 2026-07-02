import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

const createUser = async (overrides = {}) => ({
  id: 'user-1',
  email: 'user@example.com',
  password: await bcrypt.hash('123456', 10),
  nickname: '测试用户',
  role: 'user',
  status: 'enabled',
  avatarUrl: null,
  createdAt: new Date('2026-07-01T00:00:00.000Z'),
  updatedAt: new Date('2026-07-01T00:00:00.000Z'),
  ...overrides,
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    refreshToken: {
      create: jest.Mock;
      findFirst: jest.Mock;
      delete: jest.Mock;
      deleteMany: jest.Mock;
    };
  };
  let jwtService: {
    signAsync: jest.Mock;
    verifyAsync: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findFirst: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };
    jwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('登录成功时返回 access token、refresh token 和安全用户信息', async () => {
    const user = await createUser();
    prisma.user.findUnique.mockResolvedValue(user);
    jwtService.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    const result = await service.login({
      email: user.email,
      password: '123456',
    });

    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user).not.toHaveProperty('password');
    expect(prisma.refreshToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tokenHash: expect.any(String),
        userId: user.id,
      }),
    });
  });

  it('禁用用户不能登录', async () => {
    const disabledUser = await createUser({ status: 'disabled' });
    prisma.user.findUnique.mockResolvedValue(disabledUser);

    await expect(
      service.login({
        email: disabledUser.email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('刷新 token 时会校验旧 refresh token 并轮换新 token', async () => {
    const user = await createUser();
    const tokenHash = await bcrypt.hash('old-refresh-token', 10);
    jwtService.verifyAsync.mockResolvedValue({
      sub: user.id,
      tokenId: 'refresh-token-1',
    });
    prisma.refreshToken.findFirst.mockResolvedValue({
      id: 'refresh-token-1',
      tokenHash,
      userId: user.id,
      user,
      expiresAt: new Date('2026-07-08T00:00:00.000Z'),
      createdAt: new Date('2026-07-01T00:00:00.000Z'),
    });
    prisma.refreshToken.delete.mockResolvedValue({});
    jwtService.signAsync
      .mockResolvedValueOnce('new-access-token')
      .mockResolvedValueOnce('new-refresh-token');

    const result = await service.refresh('old-refresh-token');

    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).toBe('new-refresh-token');
    expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
      where: {
        id: 'refresh-token-1',
      },
    });
    expect(prisma.refreshToken.create).toHaveBeenCalled();
  });

  it('退出登录时删除对应 refresh token', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-1',
      tokenId: 'refresh-token-1',
    });
    prisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

    await service.logout('refresh-token');

    expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
      where: {
        id: 'refresh-token-1',
        userId: 'user-1',
      },
    });
  });
});
