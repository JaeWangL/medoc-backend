import { IsNotEmpty, MaxLength } from 'class-validator';
import { Field, Float, InputType, Int, ObjectType } from '@nestjs/graphql';
import { BaseModel, PaginatedCursor, PaginatedOffset } from '@common/dtos';

@InputType()
export class CreateDoctorInput {
  @Field(() => Int)
  userId: number;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  profileUrl: string;
}

@ObjectType()
export class DoctorDto extends BaseModel {
  @Field(() => Int)
  userId: number;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  profileUrl: string;

  @Field(() => Float)
  rating: number;
}

@ObjectType()
export class DoctorCursorPage extends PaginatedCursor(DoctorDto) {}

@ObjectType()
export class DoctorOffsetPage extends PaginatedOffset(DoctorDto) {}
