import { Field, Int, ObjectType } from '@nestjs/graphql';

export interface IPage<T> {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
}

export function Paginated<T>(ItemType: T): any {
  @ObjectType({ isAbstract: true })
  abstract class PageClass implements IPage<T> {
    @Field(() => Int)
    public pageIndex: number;

    @Field(() => Int)
    public pageSize: number;

    @Field(() => Int)
    public count: number;

    @Field(() => [ItemType])
    public data: T[];
  }

  return PageClass;
}
