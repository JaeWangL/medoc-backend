import { IPageOffset } from '../dtos';

export function toPageOffset<T>(pageIndex: number, pageSize: number, count: number, data: T[]): IPageOffset<T> {
  return {
    pageIndex,
    pageSize,
    count,
    data,
  };
}
