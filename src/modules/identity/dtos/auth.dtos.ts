import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/dtos';

@InputType()
export class SignInInput {
  @Field(() => String)
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  password: string;
}

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @Field(() => String)
  @MaxLength(50)
  userName: string;
}

@InputType()
export class RefreshTokenInput {
  @Field(() => String, { description: 'JWT refresh token' })
  @IsNotEmpty()
  refreshToken: string;
}

@ObjectType()
export class AuthUserDto extends BaseModel {
  @Field(() => String)
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  userName: string;

  @Field(() => String, { description: 'JWT access token' })
  @IsNotEmpty()
  accessToken: string;

  @Field(() => String, { description: 'JWT refresh token' })
  @IsNotEmpty()
  refreshToken: string;
}

@ObjectType()
export class AuthTokensDto {
  @Field(() => String, { description: 'JWT access token' })
  @IsNotEmpty()
  accessToken: string;

  @Field(() => String, { description: 'JWT refresh token' })
  @IsNotEmpty()
  refreshToken: string;
}
