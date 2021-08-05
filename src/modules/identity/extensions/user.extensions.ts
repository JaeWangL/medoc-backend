import { Users } from '@prisma/client';
import { UserDto } from '../dtos';

export const toUserDTO = (entity: Users): UserDto => ({
  id: entity.Id,
  createdAt: entity.CreatedAt,
  updatedAt: entity.UpdatedAt,
  email: entity.Email,
  userName: entity.UserName,
  role: entity.Role,
});
