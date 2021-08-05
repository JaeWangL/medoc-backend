import { IsNotEmpty, MaxLength } from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { BaseModel, PaginatedCursor, PaginatedOffset } from '@common/dtos';

@InputType()
export class CreateReviewInput {
  @Field()
  doctorId: number;

  @Field()
  userId: number;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field()
  @IsNotEmpty()
  profileUrl: string;

  @Field()
  rating: number;

  @Field()
  @IsNotEmpty()
  message: string;
}

@ObjectType()
export class ReviewDto extends BaseModel {
  @Field()
  userId: number;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field()
  @IsNotEmpty()
  profileUrl: string;

  @Field()
  rating: number;

  @Field()
  @IsNotEmpty()
  message: string;
}

@ObjectType()
export class ReviewCursorPage extends PaginatedCursor(ReviewDto) {}

@ObjectType()
export class ReviewOffsetPage extends PaginatedOffset(ReviewDto) {}
