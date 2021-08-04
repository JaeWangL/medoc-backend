import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { PaginationOffsetArgs } from '@common/dtos';
import { toPageOffset } from '@common/extensions';
import { CreateDoctorInput, DoctorDetailDto, DoctorPreviewOffsetPage } from '../dtos';
import { toDoctorsPreviewDTO } from '../extensions';
import { DoctorService } from '../services';

@Resolver((of: any) => 'Doctor')
export class DoctorResolver {
  constructor(private readonly doctorSvc: DoctorService) {}

  @Mutation((returns) => DoctorDetailDto)
  async createDoctor(@Args('input') input: CreateDoctorInput): Promise<DoctorDetailDto> {
    const newDoctor = await this.doctorSvc.createAsync(input.userId, input.name, input.profileUrl);

    return newDoctor;
  }

  /*
  @Query(() => DoctorPreviewPage)
  async findDoctorsCursor(@Args() paging: PaginationCursorArgs): Promise<DoctorPreviewPage> {
    const doctors = await this.doctorSvc.findCursorByRatingAsync(paging.after, paging.pageSize);

    return doctors[0];
  }
  */

  @Query(() => DoctorPreviewOffsetPage)
  async findDoctorsOffset(@Args() paging: PaginationOffsetArgs): Promise<DoctorPreviewOffsetPage> {
    const doctors = await this.doctorSvc.findOffsetByRatingAsync(paging.pageIndex, paging.pageSize);

    return toPageOffset(paging.pageIndex, paging.pageSize, doctors[0], toDoctorsPreviewDTO(doctors[1]));
  }
}
