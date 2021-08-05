import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationCursorArgs, PaginationOffsetArgs } from '@common/dtos';
import { toPageOffset } from '@common/extensions';
import { GqlAccessGuard } from '@infrastructure/guards';
import { CreateReviewInput, ReviewDto, ReviewCursorPage, ReviewOffsetPage } from '../dtos';
import { toReviewDTO, toReviewsDTO } from '../extensions';
import { ReviewService } from '../services';

@Resolver(() => 'Review')
@UseGuards(GqlAccessGuard)
export class ReviewResolver {
  constructor(private readonly reviewSvc: ReviewService) {}

  @Mutation(() => ReviewDto)
  async createReview(@Args('input') input: CreateReviewInput): Promise<ReviewDto> {
    const newReview = await this.reviewSvc.createAsync(
      input.doctorId,
      input.userId,
      input.name,
      input.profileUrl,
      input.rating,
      input.message,
    );

    return toReviewDTO(newReview);
  }

  @Query(() => ReviewCursorPage)
  async getReviewsCursorByDoctorId(
    @Args() paging: PaginationCursorArgs,
    @Args({ name: 'doctorId', type: () => Int }) doctorId: number,
  ): Promise<ReviewCursorPage> {
    const reviews = await this.reviewSvc.findCursorByDoctorIdAsync(
      doctorId,
      paging.after,
      paging.before,
      paging.first,
      paging.last,
    );

    return reviews;
  }

  @Query(() => ReviewOffsetPage)
  async getReviewsOffsetByDoctorId(
    @Args() paging: PaginationOffsetArgs,
    @Args({ name: 'doctorId', type: () => Int }) doctorId: number,
  ): Promise<ReviewOffsetPage> {
    const reviews = await this.reviewSvc.findOffsetByDoctorIdAsync(paging.pageIndex, paging.pageSize, doctorId);

    return toPageOffset(paging.pageIndex, paging.pageSize, reviews[0], toReviewsDTO(reviews[1]));
  }
}
