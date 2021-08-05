import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { SecurityConfig } from '@configs/index';
import { DecodedUser, JwtStrategyValidate } from '@infrastructure/interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refreshToken') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<SecurityConfig>('security')!.refreshTokenSecret,
    });
  }

  async validate(payload: DecodedUser): Promise<JwtStrategyValidate> {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
