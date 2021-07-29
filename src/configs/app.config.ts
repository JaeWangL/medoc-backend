import { AppConfig } from './app.config.interface';

const numberValue = (val: string | undefined, defaultValue: number): number => (val ? +val : defaultValue);
const boolValue = (val: string | undefined, defaultValue: boolean): boolean =>
  val == null ? defaultValue : val === 'true';

const config: AppConfig = {
  nest: {
    port: numberValue(process.env.PORT, 8080),
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    jwtSecret: process.env.medocTest ?? 'medocTest',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? '283f01ccce922bcc2399e7f8ded981285963cec349d',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRATION_TIME ?? '1d',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET ?? 'c15476aec025be7a094f97aac6eba4f69268e706e6',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): AppConfig => config;
