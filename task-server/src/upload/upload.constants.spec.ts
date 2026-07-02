import { BadRequestException } from '@nestjs/common';
import { imageFileFilter } from './upload.constants';

describe('imageFileFilter', () => {
  it('允许 png、jpg、webp 图片上传', () => {
    const callback = jest.fn();

    imageFileFilter({}, { mimetype: 'image/png' }, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it('拒绝非图片文件上传', () => {
    const callback = jest.fn();

    imageFileFilter({}, { mimetype: 'application/pdf' }, callback);

    expect(callback).toHaveBeenCalledWith(expect.any(BadRequestException), false);
  });
});
