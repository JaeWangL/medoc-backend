import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationCursorArgs {
  @Field()
  after: number;

  @Field({ defaultValue: 10 })
  pageSize: number;
}

@ArgsType()
export class PaginationOffsetArgs {
  @Field({ defaultValue: 1 })
  pageIndex: number;

  @Field({ defaultValue: 10 })
  pageSize: number;
}
