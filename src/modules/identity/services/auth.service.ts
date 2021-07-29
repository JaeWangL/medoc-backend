import Bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from '@configs/index';
import { AuthUserDto } from '../dtos';
import { DecodedUser, JwtStrategyValidate } from '../strategies';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configSvc: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userSvc: UserService,
  ) {}

  async signInAsync(email: string, password: string): Promise<AuthUserDto> {
    const securityConfig = this.configSvc.get<SecurityConfig>('security');
    const user = await this.userSvc.findByEmailAsync(email);
    const passwordCompared = await Bcrypt.compare(password, user.Password);
    if (!passwordCompared) {
      throw new UnauthorizedException('AuthService.signInAsync: Password is invalid');
    }

    const payload: JwtStrategyValidate = {
      id: user.Id,
      email: user.Email,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: securityConfig!.accessTokenExpiry,
      secret: securityConfig!.accessTokenSecret,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: securityConfig!.refreshTokenExpiry,
      secret: securityConfig!.refreshTokenSecret,
    });

    return {
      id: user.Id,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
      email: user.Email,
      userName: user.UserName,
      accessToken,
      refreshToken,
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
}
