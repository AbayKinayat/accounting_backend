export interface IFilterComparison {
  like: string,
  eq: any,
  gt: number,
  lt: number,
  notIn: any[],
  in: any[]
}

export type Filters<T extends Record<string, any> = Record<string, any>> = {
  [Property in keyof T | "and" | "or"]: IFilterComparison | { [key in keyof T]: IFilterComparison }[]
}
