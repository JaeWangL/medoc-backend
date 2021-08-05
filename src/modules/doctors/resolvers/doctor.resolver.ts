import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaginationCursorArgs, PaginationOffsetArgs } from '@common/dtos';
import { toPageOffset } from '@common/extensions';
import { GqlAccessGuard, GqlAdminGuard } from '@infrastructure/guards';
import { CreateDoctorInput, DoctorCursorPage, DoctorDto, DoctorOffsetPage } from '../dtos';
import { toDoctorDTO, toDoctorsDTO } from '../extensions';
import { DoctorService } from '../services';

@Resolver(() => 'Doctor')
@UseGuards(GqlAccessGuard, GqlAdminGuard)
export class DoctorResolver {
  constructor(private readonly doctorSvc: DoctorService) {}

  @Mutation(() => DoctorDto)
  async createDoctor(@Args('input') input: CreateDoctorInput): Promise<DoctorDto> {
    const newDoctor = await this.doctorSvc.createAsync(input.userId, input.name, input.profileUrl);

    return toDoctorDTO(newDoctor);
  }

  @Query(() => DoctorCursorPage)
  async findDoctorsCursor(@Args() paging: PaginationCursorArgs): Promise<DoctorCursorPage> {
    const doctors = await this.doctorSvc.findCursorByRatingAsync(
      paging.after,
      paging.before,
      paging.first,
      paging.last,
    );

    return doctors;
  }

  @Query(() => DoctorOffsetPage)
  async findDoctorsOffset(@Args() paging: PaginationOffsetArgs): Promise<DoctorOffsetPage> {
    const doctors = await this.doctorSvc.findOffsetByRatingAsync(paging.pageIndex, paging.pageSize);

    return toPageOffset(paging.pageIndex, paging.pageSize, doctors[0], toDoctorsDTO(doctors[1]));
  }
}
