import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  IMAGE_UPLOAD_LIMIT,
  imageFileFilter,
  imageStorage,
} from './upload.constants';
import type { UploadedImageFile } from './upload.constants';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@ApiBearerAuth()
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '图片文件，支持 png、jpg、webp，最大 2MB',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: imageStorage,
      fileFilter: imageFileFilter,
      limits: {
        fileSize: IMAGE_UPLOAD_LIMIT,
      },
    }),
  )
  uploadImage(@UploadedFile() file?: UploadedImageFile) {
    return {
      code: 200,
      message: '上传成功',
      data: this.uploadService.buildImageResponse(file),
    };
  }
}
