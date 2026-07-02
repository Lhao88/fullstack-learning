import { BadRequestException } from '@nestjs/common';
import { mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

export const UPLOAD_ROOT = join(process.cwd(), 'uploads');
export const IMAGE_UPLOAD_LIMIT = 2 * 1024 * 1024;

mkdirSync(UPLOAD_ROOT, { recursive: true });

const allowedImageMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];

export const imageFileFilter = (
  _request: unknown,
  file: Pick<Express.Multer.File, 'mimetype'>,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!allowedImageMimeTypes.includes(file.mimetype)) {
    callback(new BadRequestException('只允许上传 png、jpg、webp 图片'), false);
    return;
  }

  callback(null, true);
};

export const imageStorage = diskStorage({
  destination: UPLOAD_ROOT,
  filename: (_request, file, callback) => {
    const extension = extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

export type UploadedImageFile = Pick<
  Express.Multer.File,
  'filename' | 'mimetype' | 'size'
>;

export const getUploadUrl = (filename: string) => `/uploads/${filename}`;
