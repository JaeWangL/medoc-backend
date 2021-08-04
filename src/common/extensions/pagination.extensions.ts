import { IPage } from '../dtos';

export function toPage<T>(pageIndex: number, pageSize: number, count: number, data: T[]): IPage<T> {
  return {
    pageIndex,
    pageSize,
    count,
    data,
  };
}
