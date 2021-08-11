import { Severity } from '@sentry/node';
import { Integration, Options } from '@sentry/types';
import { ConsoleLoggerOptions } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

export type SentryModuleOptions = Omit<Options, 'integrations'> & {
  integrations?: Integration[];
} & ConsoleLoggerOptions;

export interface SentryOptionsFactory {
  createSentryModuleOptions(): Promise<SentryModuleOptions> | SentryModuleOptions;
}

export interface SentryModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useClass?: Type<SentryOptionsFactory>;
  useExisting?: Type<SentryOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SentryModuleOptions> | SentryModuleOptions;
}

export type SentryTransaction = boolean | 'path' | 'methodPath' | 'handler';

export interface SentryFilterFunction {
  (exception: any): boolean;
}

export interface SentryInterceptorOptionsFilter {
  type: any;
  filter?: SentryFilterFunction;
}

export interface SentryInterceptorOptions {
  filters?: SentryInterceptorOptionsFilter[];
  tags?: { [key: string]: string };
  extra?: { [key: string]: any };
  fingerprint?: string[];
  level?: Severity;
  // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L163
  request?: boolean;
  serverName?: boolean;
  // https://github.com/getsentry/sentry-javascript/blob/master/packages/node/src/handlers.ts#L16
  transaction?: boolean | 'path' | 'methodPath' | 'handler';
  user?: boolean | string[];
  version?: boolean;
}
