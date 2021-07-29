import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestConfig } from '@configs/index';
import { AppModule } from '@modules/app/app.module';

/**
 * NOTE
 * Change entryFile from `main.ts` to `server.ts`
 * for using Azure App Service
 * https://docs.microsoft.com/en-us/azure/app-service/configure-language-nodejs?pivots=platform-linux#run-with-pm2
 * You can change entryFile in `nest-cli.json`
 */
async function bootstrap() {
  const fAdapt = new FastifyAdapter({
    logger: false,
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fAdapt);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');

  await app.listen(
    process.env.PORT || nestConfig?.port || 8080,
    process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1',
  );
}

bootstrap();
