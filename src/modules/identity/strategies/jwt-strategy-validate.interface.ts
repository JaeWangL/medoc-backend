export interface JwtStrategyValidate {
  id: number;
  email: string;
}

export interface DecodedUser {
  readonly id: number;
  readonly email: string;
  readonly iat?: number;
  readonly exp?: number;
}
