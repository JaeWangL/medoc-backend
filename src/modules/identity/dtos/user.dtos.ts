import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/base.dtos';
import { RolesEnum } from '@infrastructure/decorators';

@InputType()
export class FindUserInput {
  @Field()
  id?: number;
}

@ObjectType()
export class UserDetailDto extends BaseModel {
  @Field()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(50)
  userName: string;

  @Field((type) => RolesEnum)
  role: RolesEnum;
}
