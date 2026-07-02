import { BadRequestException, Injectable } from '@nestjs/common';
import { getUploadUrl } from './upload.constants';
import type { UploadedImageFile } from './upload.constants';

@Injectable()
export class UploadService {
  buildImageResponse(file?: UploadedImageFile) {
    if (!file) {
      throw new BadRequestException('请选择要上传的图片');
    }

    return {
      filename: file.filename,
      url: getUploadUrl(file.filename),
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
