import { findManyCursorConnection, Connection, Edge } from '@devoxa/prisma-relay-cursor-connection';
import { Injectable } from '@nestjs/common';
import { Doctors } from '@prisma/client';
import { PrismaService } from '@shared/services';
import { DoctorDto } from '../dtos';
import { toDoctorDTO } from '../extensions';

@Injectable()
export class DoctorService {
  constructor(private readonly prismaSvc: PrismaService) {}

  async createAsync(userId: number, name: string, profileUrl: string): Promise<Doctors> {
    try {
      const newDoctor = await this.prismaSvc.doctors.create({
        data: {
          UserId: userId,
          Name: name,
          ProfileUrl: profileUrl,
        },
      });
      return newDoctor;
    } catch (e) {
      throw new Error(`DoctorService.createAsync: Unknown Error`);
    }
  }

  async findCursorByRatingAsync(
    after?: string,
    before?: string,
    first?: number,
    last?: number,
  ): Promise<Connection<DoctorDto, Edge<DoctorDto>>> {
    const baseArgs: any = {
      where: {
        Name: '11',
      },
      orderBy: {
        Rating: 'asc',
      },
    };

    const results = await findManyCursorConnection<Doctors, { id: string }, DoctorDto>(
      () => this.prismaSvc.doctors.findMany(baseArgs),
      () => this.prismaSvc.doctors.count({ where: baseArgs.where }),
      { first, last, before, after },
      {
        getCursor: (record) => ({ id: record.Id.toString() }),
        recordToEdge: (record) => ({
          node: toDoctorDTO(record),
        }),
      },
    );

    return results;
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
