import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminCategoryDto } from './dto/create-admin-category.dto';
import { UpdateAdminCategoryDto } from './dto/update-admin-category.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

const adminUserSelect = {
  id: true,
  email: true,
  nickname: true,
  role: true,
  status: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      tasks: true,
      categories: true,
    },
  },
};

const adminCategoryInclude = {
  user: {
    select: {
      id: true,
      email: true,
      nickname: true,
    },
  },
  _count: {
    select: {
      tasks: true,
    },
  },
};

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async findUsers() {
    const users = await this.prisma.user.findMany({
      select: adminUserSelect,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      code: 200,
      data: users,
    };
  }

  async findUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: adminUserSelect,
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      code: 200,
      data: user,
    };
  }

  async updateUserStatus(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
    currentUserId: string,
  ) {
    if (id === currentUserId && updateUserStatusDto.status === 'disabled') {
      throw new BadRequestException('不能禁用当前登录的管理员账号');
    }

    await this.findUser(id);

    const user = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: updateUserStatusDto.status,
      },
      select: adminUserSelect,
    });

    return {
      code: 200,
      message: '用户状态更新成功',
      data: user,
    };
  }

  async findCategories() {
    const categories = await this.prisma.category.findMany({
      include: adminCategoryInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      code: 200,
      data: categories,
    };
  }

  async createCategory(createAdminCategoryDto: CreateAdminCategoryDto) {
    const name = createAdminCategoryDto.name.trim();

    if (!name) {
      throw new BadRequestException('分类名称不能为空');
    }

    await this.ensureUserExists(createAdminCategoryDto.userId);
    await this.throwIfCategoryNameExists(name, createAdminCategoryDto.userId);

    const category = await this.prisma.category.create({
      data: {
        name,
        color: createAdminCategoryDto.color ?? 'blue',
        userId: createAdminCategoryDto.userId,
      },
      include: adminCategoryInclude,
    });

    return {
      code: 200,
      message: '创建分类成功',
      data: category,
    };
  }

  async updateCategory(
    id: string,
    updateAdminCategoryDto: UpdateAdminCategoryDto,
  ) {
    const category = await this.findCategoryOrThrow(id);
    const nextUserId = updateAdminCategoryDto.userId ?? category.userId;
    const nextName = updateAdminCategoryDto.name?.trim();

    if (updateAdminCategoryDto.name !== undefined && !nextName) {
      throw new BadRequestException('分类名称不能为空');
    }

    if (updateAdminCategoryDto.userId) {
      await this.ensureUserExists(updateAdminCategoryDto.userId);
    }

    if (nextName !== undefined || nextUserId !== category.userId) {
      await this.throwIfCategoryNameExists(
        nextName ?? category.name,
        nextUserId,
        id,
      );
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...updateAdminCategoryDto,
        userId: nextUserId,
        ...(nextName ? { name: nextName } : {}),
      },
      include: adminCategoryInclude,
    });

    return {
      code: 200,
      message: '更新分类成功',
      data: updatedCategory,
    };
  }

  async removeCategory(id: string) {
    await this.findCategoryOrThrow(id);

    await this.prisma.category.delete({
      where: {
        id,
      },
    });

    const count = await this.prisma.category.count();

    return {
      code: 200,
      message: '删除分类成功',
      length: count,
    };
  }

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }
  }

  private async findCategoryOrThrow(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  private async throwIfCategoryNameExists(
    name: string,
    userId: string,
    excludeId?: string,
  ) {
    const category = await this.prisma.category.findFirst({
      where: {
        name,
        userId,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: {
        id: true,
      },
    });

    if (category) {
      throw new ConflictException('分类名称已存在');
    }
  }
}
