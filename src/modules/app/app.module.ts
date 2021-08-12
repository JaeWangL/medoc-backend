import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { LogLevel } from '@sentry/types';
import { DateScalar } from '@common/scalars';
import { config, GraphqlConfig, SentryConfig } from '@configs/index';
import { MaxComplexityPlugin, SentryPlugin } from '@infrastructure/plugins';
import { GraphqlInterceptor, SentryModule } from '@infrastructure/sentry';
import { SharedModule } from '@shared/shared.module';
import { DoctorModule } from '../doctors/doctor.module';
import { IdentityModule } from '../identity/identity.module';
import { ReviewModule } from '../reviews/review.module';
import { UploadModule } from '../upload/upload.module';
import { AppController } from './controllers';
import { AppResolver } from './resolvers';
import { AppService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('app.graphql');
        return {
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig!.sortSchema,
          autoSchemaFile: graphqlConfig!.schemaDestination,
          debug: graphqlConfig!.debug,
          playground: graphqlConfig!.playgroundEnabled,
          plugins: [responseCachePlugin()],
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    SentryModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const sentryConfig = configService.get<SentryConfig>('app.sentry');
        return {
          dsn: sentryConfig!.dsn,
          debug: true,
          environment: 'dev', // 'dev' | 'production'
          logLevel: LogLevel.Debug,
        };
      },
      inject: [ConfigService],
    }),
    SharedModule,
    IdentityModule,
    DoctorModule,
    ReviewModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppResolver,
    MaxComplexityPlugin,
    /* SentryPlugin, */ DateScalar,
    {
      provide: APP_INTERCEPTOR,
      useClass: GraphqlInterceptor,
    },
  ],
})
export class AppModule {}
