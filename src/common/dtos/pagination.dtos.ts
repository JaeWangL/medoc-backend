import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPageOffset<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export function PaginatedOffset<T>(ItemType: T): any {
  @ObjectType({ isAbstract: true })
  abstract class PageOffsetClass implements IPageOffset<T> {
    @Field(() => Int)
    public pageIndex: number;

    @Field(() => Int)
    public pageSize: number;

    @Field(() => Int)
    public count: number;

    @Field(() => [ItemType])
    public data: T[];
  }

  return PageOffsetClass;
}
