import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUser } from '../auth/types/auth-user';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.categoryService.create(createCategoryDto, user.id);

    return {
      code: 200,
      message: '创建分类成功',
      data: result,
    };
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.categoryService.findAll(user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    const result = await this.categoryService.update(id, updateCategoryDto, user.id);

    return {
      code: 200,
      message: '更新分类成功',
      data: result,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const result = await this.categoryService.remove(id, user.id);

    return {
      code: 200,
      message: '删除分类成功',
      length: result,
    };
  }
}
