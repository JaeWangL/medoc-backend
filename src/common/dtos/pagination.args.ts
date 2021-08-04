import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationCursorArgs {
  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  before?: string;

  @Field({ nullable: true })
  first?: number;

  @Field({ nullable: true })
  last?: number;
}

@ArgsType()
export class PaginationOffsetArgs {
  @Field({ defaultValue: 1 })
  pageIndex: number;

  @Field({ defaultValue: 10 })
  pageSize: number;
}
