import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from '@prisma/client';
import { SecurityConfig } from '@configs/index';
import { JwtStrategyValidate } from './jwt-strategy-validate.interface';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(Strategy, 'accessToken') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<SecurityConfig>('security')!.accessTokenSecret,
    });
  }

  async validate(payload: Users): Promise<JwtStrategyValidate> {
    return {
      id: payload.Id,
      email: payload.Email,
    };
  }
}
