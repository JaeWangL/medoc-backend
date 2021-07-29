import Bcrypt from 'bcrypt';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, Users } from '@prisma/client';
import { PrismaService } from '@shared/services';
import { SecurityConfig } from '@configs/index';

@Injectable()
export class UserService {
  constructor(private readonly configSvc: ConfigService, private readonly prismaSvc: PrismaService) {}

  async createAsync(email: string, password: string, userName: string): Promise<boolean> {
    const hashedPassword = await Bcrypt.hash(
      password,
      this.configSvc.get<SecurityConfig>('security')!.bcryptSaltOrRound,
    );

    try {
      const newUser = await this.prismaSvc.users.create({
        data: {
          Email: email,
          Password: hashedPassword,
          UserName: userName,
        },
      });
      if (!newUser) {
        return false;
      }

      return true;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`UserService.createAsync: Email ${email} already used.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async findByIdAsync(id: number): Promise<Users> {
    const user = await this.prismaSvc.users.findUnique({
      where: { Id: id },
    });
    if (!user) {
      throw new NotFoundException(`UserService.findById: Not Found UserID - ${id}`);
    }

    return user;
  }

  async findByEmailAsync(email: string): Promise<Users> {
    const user = await this.prismaSvc.users.findUnique({
      where: { Email: email },
    });
    if (!user) {
      throw new NotFoundException(`UserService.findByEmailAsync: Not Found Email - ${email}`);
    }

    return user;
  }
}
