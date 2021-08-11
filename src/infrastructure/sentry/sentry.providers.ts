import { Provider } from '@nestjs/common';
import { SENTRY_TOKEN } from './sentry.constants';
import { SentryModuleOptions } from './sentry.interfaces';
import { SentryService } from './sentry.service';

export function createSentryProviders(options: SentryModuleOptions): Provider {
  return {
    provide: SENTRY_TOKEN,
    useValue: new SentryService(options),
  };
}
