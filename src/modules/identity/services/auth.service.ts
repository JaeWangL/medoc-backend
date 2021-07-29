import Bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from '@configs/index';
import { AuthUserDto } from '../dtos';
import { UserService } from './user.service';

export interface SignInPayload {
  readonly id: number;
  readonly email: string;
}

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

    const payload: SignInPayload = {
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
}
