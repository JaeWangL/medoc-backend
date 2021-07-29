import { IsNotEmpty, MaxLength } from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/base.dtos';

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

  @Field()
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

  @Field()
  rating: number;
}
