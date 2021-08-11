import { FastifyRequest } from 'fastify';
import { BadRequestException, Controller, ForbiddenException, NotAcceptableException, Post, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConsumes, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AzureConfig } from '@configs/index';
import { ApiFile } from '@infrastructure/decorators';
import { BlobService } from '@shared/services';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly configSvc: ConfigService, private readonly blobSvc: BlobService) {}

  @Post('image')
  @ApiConsumes('multipart/form-data')
  @ApiFile('image')
  @ApiOperation({ summary: 'Blob 에 에디터 내부의 이미지 업로드 (Single)' })
  async uploadImage(@Req() req: FastifyRequest): Promise<string> {
    const azureConfig = this.configSvc.get<AzureConfig>('azure');
    if (!azureConfig!.blobTestContainer) {
      throw new ForbiddenException('UploadController.uploadImage: blob container name not found');
    }
    if (!req.isMultipart) {
      throw new BadRequestException('UploadController.uploadImage: Reqeust is not multipart');
    }

    const uploadedImage = await req.file();
    const result = await this.blobSvc.uploadBlobAsync(azureConfig!.blobTestContainer, uploadedImage);
    if (!result) {
      throw new NotAcceptableException('UploadController.uploadImage: Uploading file was failed');
    }

    return result;
  }
}
