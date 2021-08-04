import { IsNotEmpty, MaxLength } from 'class-validator';
import { InputType, Field, Float, ObjectType } from '@nestjs/graphql';
import { BaseModel, PaginatedCursor, PaginatedOffset } from '@common/dtos';

@InputType()
export class CreateDoctorInput {
  @Field()
  userId: number;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field()
  @IsNotEmpty()
  profileUrl: string;
}

@ObjectType()
export class DoctorDetailDto extends BaseModel {
  @Field()
  userId: number;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field()
  @IsNotEmpty()
  profileUrl: string;

  @Field(() => Float)
  rating: number;
}

@ObjectType()
export class DoctorPreviewDto extends BaseModel {
  @Field()
  userId: number;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field()
  @IsNotEmpty()
  profileUrl: string;

  @Field(() => Float)
  rating: number;
}

@ObjectType()
export class DoctorPreviewCursorPage extends PaginatedCursor(DoctorPreviewDto) {}

@ObjectType()
export class DoctorPreviewOffsetPage extends PaginatedOffset(DoctorPreviewDto) {}
