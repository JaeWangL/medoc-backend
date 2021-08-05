import { Module } from '@nestjs/common';
import { ReviewResolver } from './resolvers';
import { ReviewService } from './services';

const AllResolvers = [ReviewResolver];
const AllServices = [ReviewService];

@Module({
  providers: [...AllResolvers, ...AllServices],
  exports: [...AllServices],
})
export class ReviewModule {}
