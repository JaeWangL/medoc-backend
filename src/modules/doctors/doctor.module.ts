import { Module } from '@nestjs/common';
import { DoctorResolver } from './resolvers';
import { DoctorService } from './services';

const AllResolvers = [DoctorResolver];
const AllServices = [DoctorService];

@Module({
  providers: [...AllResolvers, ...AllServices],
  exports: [...AllServices],
})
export class DoctorModule {}
