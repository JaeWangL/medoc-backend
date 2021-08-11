import DayJS from 'dayjs';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient } from '@azure/storage-blob';
import { Multipart } from 'fastify-multipart';

@Injectable()
export class BlobService {
  private readonly blobClient: BlobServiceClient | undefined;

  constructor(private readonly configSvc: ConfigService) {
    if (!process.env.BLOB_CONNECTION_STRING) {
      throw new NotFoundException('BlobService: Blob Connection String no found');
    }

    this.blobClient = BlobServiceClient.fromConnectionString(process.env.BLOB_CONNECTION_STRING);
  }

  async uploadBlobAsync(containerName: string, file: Multipart): Promise<string | undefined> {
    if (!this.blobClient) {
      return undefined;
    }

    try {
      const containerClient = this.blobClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(`${DayJS(new Date()).valueOf()}_${file.filename}`);
      const uploaded = await blockBlobClient.uploadStream(file.file);
      if (uploaded.errorCode) {
        return undefined;
      }

      return blockBlobClient.url;
    } catch (error) {
      Logger.error(`BlobService.uploadBlobAsync: ${error.toString()}`);
    }

    return undefined;
  }

  async deleteBlobAsync(containerName: string, blobName: string): Promise<void> {
    if (!this.blobClient) {
      return;
    }

    try {
      const containerClient = this.blobClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      await blockBlobClient.deleteIfExists();
    } catch (error) {
      Logger.error(`BlobService.deleteBlobAsync: ${error.toString()}`);
    }
  }
}
