import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { SecurityConfig } from '@configs/index';
import { AuthResolver, UserResolver } from './resolvers';
import { AuthService, TokenService, UserService } from './services';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategies';

const AllResolvers = [AuthResolver, UserResolver];
const AllServices = [AuthService, TokenService, UserService];

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<SecurityConfig>('app.security')!.jwtSecret,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtAccessStrategy, JwtRefreshStrategy, ...AllResolvers, ...AllServices],
  exports: [...AllServices],
})
export class IdentityModule {}
