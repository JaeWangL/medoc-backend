import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { SecurityConfig } from '@configs/index';
import { DecodedUser, JwtStrategyValidate } from '@infrastructure/interfaces';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<SecurityConfig>('app.security')!.accessTokenSecret,
    });
  }

  validate(payload: DecodedUser): JwtStrategyValidate {
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
