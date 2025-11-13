export type Page<T> = {
  content: T[];
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
  size: number;
  number: number;
}
