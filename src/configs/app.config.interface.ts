export interface NestConfig {
  port: number;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  jwtSecret: string;
  accessTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenSecret: string;
  refreshTokenExpiry: string;
  bcryptSaltOrRound: string | number;
}

export interface AppConfig {
  nest: NestConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
}
