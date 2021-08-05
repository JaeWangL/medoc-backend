import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GqlAccessGuard } from '@infrastructure/guards';
import { FindUserInput, UserDto } from '../dtos';
import { toUserDTO } from '../extensions';
import { UserService } from '../services';

@Resolver(() => 'User')
@UseGuards(GqlAccessGuard)
export class UserResolver {
  constructor(private userSvc: UserService) {}

  @Query(() => UserDto)
  async findUser(@Args('args') args: FindUserInput): Promise<UserDto> {
    const user = await this.userSvc.findByIdAsync(args.id!);

    return toUserDTO(user);
  }
}
