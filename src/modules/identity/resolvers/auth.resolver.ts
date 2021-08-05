import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthTokensDto, AuthUserDto, RefreshTokenInput, SignInInput, SignUpInput } from '../dtos';
import { AuthService, UserService } from '../services';

@Resolver(() => 'Auth')
export class AuthResolver {
  constructor(private readonly authSvc: AuthService, private readonly userSvc: UserService) {}

  @Mutation(() => Boolean)
  async signUp(@Args('data') data: SignUpInput): Promise<boolean> {
    const res = await this.userSvc.createAsync(data.email, data.password, data.userName);

    return res;
  }

  @Mutation(() => AuthUserDto)
  async signIn(@Args('data') data: SignInInput): Promise<AuthUserDto> {
    const result = await this.authSvc.signInAsync(data.email, data.password);

    return result;
  }

  @Mutation(() => AuthTokensDto)
  async refreshToken(@Args('data') data: RefreshTokenInput): Promise<AuthTokensDto> {
    const result = await this.authSvc.refreshTokenAsync(data.refreshToken);

    return result;
  }
}
