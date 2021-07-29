import { CustomDecorator, SetMetadata } from '@nestjs/common';

export enum RolesEnum {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}

export const Roles = (...roles: RolesEnum[]): CustomDecorator<string> => SetMetadata('roles', roles);
