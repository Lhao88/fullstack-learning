import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const name = createCategoryDto.name.trim();
    if (!name) {
      throw new BadRequestException('分类名称不能为空');
    }

    await this.throwIfNameExists(name, userId);

    return this.prisma.category.create({
      data: {
        name,
        color: createCategoryDto.color ?? 'blue',
        userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return {
      code: 200,
      data: categories,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, userId: string) {
    await this.findCategoryOrThrow(id, userId);

    const nextName = updateCategoryDto.name?.trim();

    if (updateCategoryDto.name !== undefined && !nextName) {
      throw new BadRequestException('分类名称不能为空');
    }

    if (nextName !== undefined) {
      await this.throwIfNameExists(nextName, userId, id);
    }

    return this.prisma.category.update({
      where: {
        id,
      },
      data: {
        ...updateCategoryDto,
        ...(nextName ? { name: nextName } : {}),
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findCategoryOrThrow(id, userId);

    await this.prisma.category.delete({
      where: {
        id,
      },
    });

    return this.prisma.category.count({
      where: {
        userId,
      },
    });
  }

  async existsForUser(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });

    return Boolean(category);
  }

  private async findCategoryOrThrow(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!category) {
      throw new NotFoundException('分类不存在');
    }

    return category;
  }

  private async throwIfNameExists(name: string, userId: string, excludeId?: string) {
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
