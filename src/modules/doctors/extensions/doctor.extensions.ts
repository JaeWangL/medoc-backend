import { Doctors } from '@prisma/client';
import { DoctorDetailDto, DoctorPreviewDto } from '../dtos';

export const toDoctorDetailDTO = (entity: Doctors): DoctorDetailDto => ({
  id: entity.Id,
  createdAt: entity.CreatedAt,
  updatedAt: entity.UpdatedAt,
  userId: entity.UserId,
  name: entity.Name,
  profileUrl: entity.ProfileUrl,
  rating: entity.Rating.toNumber(),
});

export const toDoctorPreviewDTO = (entity: Doctors): DoctorPreviewDto => ({
  id: entity.Id,
  createdAt: entity.CreatedAt,
  updatedAt: entity.UpdatedAt,
  userId: entity.UserId,
  name: entity.Name,
  profileUrl: entity.ProfileUrl,
  rating: entity.Rating.toNumber(),
});

export const toDoctorsPreviewDTO = (entities: Doctors[]): DoctorPreviewDto[] =>
  entities.map((entity) => toDoctorPreviewDTO(entity));
