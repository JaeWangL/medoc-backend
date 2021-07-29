import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from '@infrastructure/guards/gql-access.guard';
import { GetUserArgs } from '../args';
import { UserDetailDto } from '../dtos';
import { toUserDetailDTO } from '../extensions';
import { UserService } from '../services';

@Resolver((of: any) => 'User')
@UseGuards(GqlAccessGuard)
export class UserResolver {
  constructor(private userSvc: UserService) {}

  @Query((returns: any) => UserDetailDto)
  async findUser(@Args('id') id: number): Promise<UserDetailDto> {
    const user = await this.userSvc.findByIdAsync(id);

    return toUserDetailDTO(user);
  }
}
