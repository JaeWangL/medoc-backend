import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthUserDto, SignInInput, SignUpInput } from '../dtos';
import { AuthService, UserService } from '../services';

@Resolver((of: any) => 'Auth')
export class AuthResolver {
  constructor(private readonly authSvc: AuthService, private readonly userSvc: UserService) {}

  @Mutation((returns) => Boolean)
  async signUp(@Args('data') data: SignUpInput): Promise<boolean> {
    const res = await this.userSvc.createAsync(data.email, data.password, data.userName);

    return res;
  }

  @Mutation((returns) => AuthUserDto)
  async signIn(@Args('data') data: SignInInput): Promise<AuthUserDto> {
    const result = await this.authSvc.signInAsync(data.email, data.password);

    return result;
  }
}
