import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';

export enum RolesEnum {
  Admin = 2,
  Manager = 1,
  User = 0,
}

export const Roles = (...roles: RolesEnum[]): CustomDecorator<string> => SetMetadata('roles', roles);

registerEnumType(RolesEnum, {
  name: 'Roles',
});
