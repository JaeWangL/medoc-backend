import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Tokens } from '@prisma/client';
import { PrismaService } from '@shared/services';

@Injectable()
export class TokenService {
  constructor(private readonly prismaSvc: PrismaService) {}

  async createAsync(email: string, refreshToken: string): Promise<boolean> {
    try {
      const newToken = await this.prismaSvc.tokens.create({
        data: {
          Email: email,
          Token: refreshToken,
        },
      });
      if (!newToken) {
        return false;
      }

      return true;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(`TokenService.createAsync: Email ${email} already used.`);
      } else {
        throw new Error(e);
      }
    }
  }

  async findByEmailAsync(email: string): Promise<Tokens> {
    const token = await this.prismaSvc.tokens.findUnique({
      where: { Email: email },
    });
    if (!token) {
      throw new NotFoundException(`TokenService.findByEmailAsync: Not Found Email - ${email}`);
    }

    return token;
  }

  async upsertByEmailAsync(email: string, refreshToken: string): Promise<Tokens> {
    const updated = await this.prismaSvc.tokens.upsert({
      where: {
        Email: email,
      },
      update: {
        Token: refreshToken,
      },
      create: {
        Email: email,
        Token: refreshToken,
      },
    });

    return updated;
  }
}
