import Bcrypt from 'bcrypt';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from '@configs/index';
import { AuthTokensDto, AuthUserDto } from '../dtos';
import { DecodedUser, JwtStrategyValidate } from '../strategies';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configSvc: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenSvc: TokenService,
    private readonly userSvc: UserService,
  ) {}

  async signInAsync(email: string, password: string): Promise<AuthUserDto> {
    const user = await this.userSvc.findByEmailAsync(email);
    const passwordCompared = await Bcrypt.compare(password, user.Password);
    if (!passwordCompared) {
      throw new UnauthorizedException('AuthService.signInAsync: Password is invalid');
    }

    const tokens = await this.generateTokens(user.Id, user.Email);

    return {
      id: user.Id,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
      email: user.Email,
      userName: user.UserName,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    } as AuthUserDto;
  }

  async verifyTokenAsync(token: string, secret: string): Promise<DecodedUser | null> {
    try {
      const user = await this.jwtService.verifyAsync(token, { secret });

      return user;
    } catch (error) {
      return null;
    }
  }

  async refreshTokenAsync(oldToken: string): Promise<AuthTokensDto> {
    const decodedUser = this.jwtService.decode(oldToken) as DecodedUser | null;
    if (!decodedUser) {
      throw new ForbiddenException('AuthService.refreshTokenAsync: Incorrect token');
    }

    const oldRefreshToken = await this.tokenSvc.findByEmailAsync(decodedUser.email);
    if (oldRefreshToken.Token !== oldToken) {
      throw new UnauthorizedException('AuthService.refreshTokenAsync: credentials were missing or incorrect');
    }

    return this.generateTokens(decodedUser.id, decodedUser.email);
  }

  private async generateTokens(id: number, email: string): Promise<AuthTokensDto> {
    const securityConfig = this.configSvc.get<SecurityConfig>('security');
    const payload: JwtStrategyValidate = {
      id,
      email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: securityConfig!.accessTokenExpiry,
      secret: securityConfig!.accessTokenSecret,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: securityConfig!.refreshTokenExpiry,
      secret: securityConfig!.refreshTokenSecret,
    });

    await this.tokenSvc.createAsync(email, refreshToken);

    return { accessToken, refreshToken };
  }
}
