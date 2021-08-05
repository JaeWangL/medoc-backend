import { findManyCursorConnection, Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { Reviews } from '@prisma/client';
import { PrismaService } from '@shared/services';
import { ReviewDto } from '../dtos';
import { toReviewDTO } from '../extensions';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaSvc: PrismaService) {}

  async createAsync(
    doctorId: number,
    userId: number,
    name: string,
    profileUrl: string,
    rating: number,
    message: string,
  ): Promise<Reviews> {
    try {
      const newReview = await this.prismaSvc.reviews.create({
        data: {
          DoctorId: doctorId,
          UserId: userId,
          Name: name,
          ProfileUrl: profileUrl,
          Rating: rating,
          Message: message,
        },
      });
      return newReview;
    } catch (e) {
      throw new Error(`DoctorService.createAsync: Unknown Error`);
    }
  }

  async findCursorByDoctorIdAsync(
    doctorId: number,
    after?: string,
    before?: string,
    first?: number,
    last?: number,
  ): Promise<Connection<ReviewDto, Edge<ReviewDto>>> {
    const baseArgs: any = {
      where: {
        DoctorId: doctorId,
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    };

    const results = await findManyCursorConnection<Reviews, { id: string }, ReviewDto>(
      () => this.prismaSvc.reviews.findMany(baseArgs),
      () => this.prismaSvc.reviews.count({ where: baseArgs.where }),
      { first, last, before, after },
      {
        getCursor: (record) => ({ id: record.Id.toString() }),
        recordToEdge: (record) => ({
          node: toReviewDTO(record),
        }),
      },
    );

    return results;
  }

  async findOffsetByDoctorIdAsync(pageIndex: number, pageSize: number, doctorId: number): Promise<[number, Reviews[]]> {
    const totalCount = await this.prismaSvc.reviews.count();
    const reviews = await this.prismaSvc.reviews.findMany({
      where: {
        DoctorId: doctorId,
      },
      orderBy: {
        CreatedAt: 'desc',
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });

    return [totalCount, reviews];
  }
}
