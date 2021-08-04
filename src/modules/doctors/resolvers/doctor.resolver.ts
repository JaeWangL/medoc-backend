import { Args, Resolver, Mutation, Query } from '@nestjs/graphql';
import { PaginationCursorArgs, PaginationOffsetArgs } from '@common/dtos';
import { toPage } from '@common/extensions';
import { CreateDoctorInput, DoctorDetailDto, DoctorPreviewPage } from '../dtos';
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

  @Query(() => DoctorPreviewPage)
  async findDoctorsOffset(@Args() paging: PaginationOffsetArgs): Promise<DoctorPreviewPage> {
    const doctors = await this.doctorSvc.findOffsetByRatingAsync(paging.pageIndex, paging.pageSize);

    return toPage(paging.pageIndex, paging.pageSize, doctors[0], toDoctorsPreviewDTO(doctors[1]));
  }
}
