import { findManyCursorConnection, Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { Doctors } from '@prisma/client';
import { PrismaService } from '@shared/services';
import { DoctorDetailDto } from '../dtos';
import { toDoctorDetailDTO } from '../extensions';

@Injectable()
export class DoctorService {
  constructor(private readonly prismaSvc: PrismaService) {}

  async createAsync(userId: number, name: string, profileUrl: string): Promise<DoctorDetailDto> {
    try {
      const newDoctor = await this.prismaSvc.doctors.create({
        data: {
          UserId: userId,
          Name: name,
          ProfileUrl: profileUrl,
        },
      });
      return toDoctorDetailDTO(newDoctor);
    } catch (e) {
      throw new Error(`DoctorService.createAsync: Unknown Error`);
    }
  }

  async findCursorByRatingAsync(after: number, pageSize: number): Promise<[number, Doctors[]]> {
    const totalCount = await this.prismaSvc.doctors.count();
    const doctors = await this.prismaSvc.doctors.findMany({
      cursor: {
        Id: after,
      },
      orderBy: {
        Rating: 'asc',
      },
      skip: 1,
      take: pageSize,
    });

    return [totalCount, doctors];
  }

  async findOffsetByRatingAsync(pageIndex: number, pageSize: number): Promise<[number, Doctors[]]> {
    const totalCount = await this.prismaSvc.doctors.count();
    const doctors = await this.prismaSvc.doctors.findMany({
      orderBy: {
        Rating: 'asc',
      },
      skip: (pageIndex - 1) * pageSize,
      take: pageSize,
    });

    return [totalCount, doctors];
  }
}
