import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/base.dtos';

@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @Field()
  @MaxLength(50)
  userName: string;
}

@ObjectType()
export class AuthUserDto extends BaseModel {
  @Field()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  userName: string;

  @Field({ description: 'JWT access token' })
  accessToken: string;

  @Field({ description: 'JWT refresh token' })
  refreshToken: string;
}
