import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';


@Module({
  imports: [TaskModule, PrismaModule, AuthModule, CategoryModule, AdminModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
