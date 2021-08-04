import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@common/dtos';
import { RolesEnum } from '@infrastructure/decorators';

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
