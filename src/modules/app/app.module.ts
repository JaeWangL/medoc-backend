import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DateScalar } from '@common/scalars';
import { config, GraphqlConfig } from '@configs/index';
import { MaxComplexityPlugin, SentryPlugin } from '@infrastructure/plugins';
import { SharedModule } from '@shared/shared.module';
import { DoctorModule } from '../doctors/doctor.module';
import { IdentityModule } from '../identity/identity.module';
import { ReviewModule } from '../reviews/review.module';
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
          plugins: [responseCachePlugin()],
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    SharedModule,
    IdentityModule,
    DoctorModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, MaxComplexityPlugin, SentryPlugin, DateScalar],
})
export class AppModule {}
