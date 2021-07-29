import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

const services = [PrismaService];

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: services,
  exports: services,
})
export class SharedModule {}
