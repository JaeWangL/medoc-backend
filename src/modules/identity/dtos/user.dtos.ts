import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { BaseModel } from '@common/dtos';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
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
