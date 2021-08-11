import { Inject, Injectable, ConsoleLogger } from '@nestjs/common';
import { Options, Client } from '@sentry/types';
import * as Sentry from '@sentry/node';
import { SENTRY_MODULE_OPTIONS } from './sentry.constants';
import { SentryModuleOptions } from './sentry.interfaces';

@Injectable()
export class SentryService extends ConsoleLogger {
  app = '@ntegral/nestjs-sentry: ';

  private static serviceInstance: SentryService;

  constructor(
    @Inject(SENTRY_MODULE_OPTIONS)
    readonly opts?: SentryModuleOptions,
  ) {
    super();
    if (!(opts && opts.dsn)) {
      return;
    }
    const { debug, integrations = [], ...sentryOptions } = opts;
    Sentry.init({
      ...sentryOptions,
      integrations: [
        new Sentry.Integrations.OnUncaughtException({
          onFatalError: async (err) => {
            if (err.name === 'SentryError') {
              console.log(err);
            } else {
              (Sentry.getCurrentHub().getClient<Client<Options>>() as Client<Options>).captureException(err);
              process.exit(1);
            }
          },
        }),
        new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
        ...integrations,
      ],
    });
  }

  public static SentryServiceInstance(): SentryService {
    if (!SentryService.serviceInstance) {
      SentryService.serviceInstance = new SentryService();
    }
    return SentryService.serviceInstance;
  }

  log(message: string, context?: string): void {
    const logMessage = `${this.app} ${message}`;
    try {
      Sentry.captureMessage(logMessage, Sentry.Severity.Log);
      super.log(logMessage, context);
    } catch (err) {
      // TODO: Something
    }
  }

  error(message: string, trace?: string, context?: string): void {
    const logMessage = `${this.app} ${message}`;
    try {
      super.error(logMessage, trace, context);
      Sentry.captureMessage(logMessage, Sentry.Severity.Error);
    } catch (err) {
      // TODO: Something
    }
  }

  warn(message: string, context?: string): void {
    const logMessage = `${this.app} ${message}`;
    try {
      super.warn(logMessage, context);
      Sentry.captureMessage(logMessage, Sentry.Severity.Warning);
    } catch (err) {
      // TODO: Something
    }
  }

  debug(message: string, context?: string): void {
    const logMessage = `${this.app} ${message}`;
    try {
      super.debug(logMessage, context);
      Sentry.captureMessage(logMessage, Sentry.Severity.Debug);
    } catch (err) {
      // TODO: Something
    }
  }

  verbose(message: string, context?: string): void {
    const logMessage = `${this.app} ${message}`;
    try {
      super.verbose(logMessage, context);
      Sentry.captureMessage(logMessage, Sentry.Severity.Info);
    } catch (err) {
      // TODO: Something
    }
  }

  instance(): typeof Sentry {
    return Sentry;
  }
}
