import { Reviews } from '@prisma/client';
import { ReviewDto } from '../dtos';

export const toReviewDTO = (entity: Reviews): ReviewDto => ({
  id: entity.Id,
  createdAt: entity.CreatedAt,
  updatedAt: entity.UpdatedAt,
  userId: entity.UserId,
  name: entity.Name,
  profileUrl: entity.ProfileUrl,
  rating: entity.Rating,
  message: entity.Message,
});

export const toReviewsDTO = (entities: Reviews[]): ReviewDto[] => entities.map((entity) => toReviewDTO(entity));
