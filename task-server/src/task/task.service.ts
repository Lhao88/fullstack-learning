import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { TaskStatus } from '../types/task';

const nextStatusMap: Record<TaskStatus, TaskStatus> = {
  todo: 'doing',
  doing: 'done',
  done: 'todo',
};

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        level: createTaskDto.level,
        status: 'todo',
        userId,
      },
    });
  }

  async findAll(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      code: 200,
      data: tasks,
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    return {
      code: 200,
      data: task,
    };
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    await this.findTaskOrThrow(id, userId);

    return this.prisma.task.update({
      where: {
        id,
      },
      data: updateTaskDto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findTaskOrThrow(id, userId);

    await this.prisma.task.delete({
      where: {
        id,
      },
    });

    return this.prisma.task.count({
      where: {
        userId,
      },
    });
  }

  async changeToNextStatus(id: string, userId: string) {
    const task = await this.findTaskOrThrow(id, userId);

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        status: nextStatusMap[task.status],
      },
    });
  }

  private async findTaskOrThrow(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException('任务不存在');
    }

    return task;
  }
}
