import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DateScalar } from '@common/scalars';
import { config, GraphqlConfig } from '@configs/index';
import { SharedModule } from '@shared/shared.module';
import { apolloServerSentryPlugin } from '../../sentry.plugin';
import { IdentityModule } from '../identity/identity.module';
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
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          installSubscriptionHandlers: false,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig!.sortSchema,
          autoSchemaFile: graphqlConfig!.schemaDestination,
          debug: graphqlConfig!.debug,
          playground: graphqlConfig!.playgroundEnabled,
          plugins: [apolloServerSentryPlugin],
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    SharedModule,
    IdentityModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver /* , DateScalar */],
})
export class AppModule {}
