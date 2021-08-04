import { FastifyRequest } from 'fastify';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { RolesEnum } from '@infrastructure/decorators';
import { DecodedUser } from '@infrastructure/interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const tokenData = this.jwtService.decode(
      request.headers.authorization?.split('Bearer')[1].trim() as string,
    ) as DecodedUser | null;
    if (tokenData?.role === RolesEnum.Admin) {
      return true;
    }

    return !tokenData ? false : roles.includes(tokenData?.role.toString());
  }
}
