import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { CreateDoctorInput, DoctorDetailDto } from '../dtos';
import { DoctorService } from '../services';

@Resolver((of: any) => 'Doctor')
export class DoctorResolver {
  constructor(private readonly doctorSvc: DoctorService) {}

  @Mutation((returns) => DoctorDetailDto)
  async createDoctor(@Args('data') data: CreateDoctorInput): Promise<DoctorDetailDto> {
    const newDoctor = await this.doctorSvc.createAsync(data.userId, data.name, data.profileUrl);

    return newDoctor;
  }
}
