import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SignUpInput } from '../dtos';
import { UserService } from '../services';

@Resolver((of: any) => 'Auth')
export class AuthResolver {
  constructor(private readonly userSvc: UserService) {}

  @Mutation((returns) => Boolean)
  async signUp(@Args('data') data: SignUpInput): Promise<boolean> {
    const res = await this.userSvc.createAsync(data.email, data.password, data.userName);

    return res;
  }
}
