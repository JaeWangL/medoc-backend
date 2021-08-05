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
export class DoctorDto extends BaseModel {
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
export class DoctorCursorPage extends PaginatedCursor(DoctorDto) {}

@ObjectType()
export class DoctorOffsetPage extends PaginatedOffset(DoctorDto) {}
