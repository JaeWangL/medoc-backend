import { RolesEnum } from '@infrastructure/decorators';

export interface JwtStrategyValidate {
  id: number;
  email: string;
  role: RolesEnum;
}

export interface DecodedUser {
  readonly id: number;
  readonly email: string;
  readonly role: RolesEnum;
  readonly iat?: number;
  readonly exp?: number;
}
