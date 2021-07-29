import { Users } from '@prisma/client';
import { UserDetailDto } from '../dtos';

export const toUserDetailDTO = (entity: Users): UserDetailDto => ({
  id: entity.Id,
  email: entity.Email,
  userName: entity.UserName,
  role: entity.Role,
  createdAt: entity.CreatedAt,
  updatedAt: entity.UpdatedAt,
});
