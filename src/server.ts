import DayJS from 'dayjs';
import PluginUTC from 'dayjs/plugin/utc';
import FastifyCompress from 'fastify-compress';
import FastifyHelmet from 'fastify-helmet';
import FastifyMultipart from 'fastify-multipart';
import FastifyRateLimiter from 'fastify-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { NestConfig } from '@configs/index';
import { LoggingInterceptor } from '@infrastructure/interceptors';
import { AppModule } from '@modules/app/app.module';

DayJS.extend(PluginUTC);
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

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
  fAdapt.register(FastifyCompress);
  fAdapt.register(FastifyRateLimiter, {
    max: 100, // limit each IP to 100 requests per windowMs
    timeWindow: 2 * 60 * 1000, // 2 minutes
  });
  fAdapt.register(FastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  fAdapt.register(FastifyMultipart);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fAdapt);
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const options = new DocumentBuilder()
    .setTitle('API v1')
    .setDescription('The main backend for MeDoc')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: `JWT Authorization header using the Bearer scheme.
\r\n\r\nEnter 'Bearer' [space] and then your token in client application.
\r\n\r\nExample: 'Bearer 12345abcdef'`,
      name: 'Authorization',
      in: 'Header',
      scheme: 'Bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');

  await app.listen(
    process.env.PORT || nestConfig?.port || 8080,
    process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1',
  );
}

bootstrap();
