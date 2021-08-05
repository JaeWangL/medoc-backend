import { IsNotEmpty, MaxLength } from 'class-validator';
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel, PaginatedCursor, PaginatedOffset } from '@common/dtos';

@InputType()
export class CreateReviewInput {
  @Field(() => Int)
  doctorId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  profileUrl: string;

  @Field(() => Int)
  rating: number;

  @Field(() => String)
  @IsNotEmpty()
  message: string;
}

@ObjectType()
export class ReviewDto extends BaseModel {
  @Field(() => Int)
  userId: number;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  profileUrl: string;

  @Field(() => Int)
  rating: number;

  @Field(() => String)
  @IsNotEmpty()
  message: string;
}

@ObjectType()
export class ReviewCursorPage extends PaginatedCursor(ReviewDto) {}

@ObjectType()
export class ReviewOffsetPage extends PaginatedOffset(ReviewDto) {}
