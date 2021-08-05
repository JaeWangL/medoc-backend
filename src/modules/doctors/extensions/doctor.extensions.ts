import { Doctors } from '@prisma/client';
import { DoctorDto } from '../dtos';

export const toDoctorDTO = (entity: Doctors): DoctorDto => ({
  id: entity.Id,
  createdAt: entity.CreatedAt,
  updatedAt: entity.UpdatedAt,
  userId: entity.UserId,
  name: entity.Name,
  profileUrl: entity.ProfileUrl,
  rating: entity.Rating.toNumber(),
});

export const toDoctorsDTO = (entities: Doctors[]): DoctorDto[] => entities.map((entity) => toDoctorDTO(entity));
