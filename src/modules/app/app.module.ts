import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DateScalar } from '@common/scalars';
import { config, GraphqlConfig } from '@configs/index';
import { SharedModule } from '@shared/shared.module';
import { IdentityModule } from '../identity/identity.module';
import { AppController } from './controllers';
import { AppResolver } from './resolvers';
import { AppService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
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
