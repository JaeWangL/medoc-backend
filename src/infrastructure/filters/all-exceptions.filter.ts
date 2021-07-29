import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { FastifyReply } from 'fastify';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      response.status(status).send(exception.getResponse());
      return;
    }

    Sentry.captureException(exception);

    response.status(status).send({
      statusCode: status,
      message: 'We got an error in processing this request',
      error: 'Internal server error',
    });
  }
}
