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
export class UserDto extends BaseModel {
  @Field(() => String)
  @IsEmail()
  @MaxLength(50)
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(50)
  userName: string;

  @Field(() => RolesEnum)
  role: RolesEnum;
}
