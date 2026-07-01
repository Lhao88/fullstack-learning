import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [PrismaModule, CategoryModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
