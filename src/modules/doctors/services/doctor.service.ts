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

  async findByRatingAsync(skip = 0, take = 10): Promise<Doctors[]> {
    const doctors = await this.prismaSvc.doctors.findMany({
      orderBy: {
        Rating: 'asc',
      },
      skip,
      take,
    });

    return doctors;
  }
}
