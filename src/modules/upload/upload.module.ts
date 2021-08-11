import { Module } from '@nestjs/common';
import { UploadController } from './controllers';

const AllControllers = [UploadController];

@Module({
  providers: [...AllControllers],
  controllers: [...AllControllers],
})
export class UploadModule {}
