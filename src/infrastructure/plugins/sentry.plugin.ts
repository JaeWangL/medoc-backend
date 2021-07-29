import { ApolloServerPlugin, GraphQLRequestContext, GraphQLRequestListener } from 'apollo-server-plugin-base';
import { get } from 'lodash';
import { Plugin } from '@nestjs/graphql';
import * as Sentry from '@sentry/node';

@Plugin()
export class SentryPlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener> {
    return {
      async didEncounterErrors(rc: GraphQLRequestContext): Promise<void> {
        Sentry.withScope((scope) => {
          scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, (rc.context as any).req));

          const user = get(rc, 'context.req.user');

          if (user) {
            scope.setUser({
              user,
            });
          }

          scope.setExtra(
            get(rc, 'operation.operation', 'parse_err'),
            get(rc, 'operationName', get(rc, 'request.operationName')),
          );

          rc.errors?.forEach((error: any) => {
            if (error.name === 'PersistedQueryNotFoundError') {
              return;
            }

            if (error.path || error.name !== 'GraphQLError') {
              scope.setExtra('path', error.path);
              Sentry.captureException(error);
            } else {
              Sentry.captureMessage(`GraphQLWrongQuery: ${error.message}`);
            }
          });
        });
      },
    };
  }
}
