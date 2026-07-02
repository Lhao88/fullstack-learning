import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

const createContext = (user: { role: string }): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        user,
      }),
    }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  it('超级管理员角色匹配时允许访问', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['super_admin']),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext({ role: 'super_admin' }))).toBe(true);
  });

  it('普通用户访问超级管理员接口时拒绝', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['super_admin']),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext({ role: 'user' }))).toBe(false);
  });
});
