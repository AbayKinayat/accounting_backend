export interface ICategory {
  id: number;
  name: string;
  typeId: number,
  iconId: string,
  sum?: number,
  count?: number
  createdAt: string,
  updatedAt: StringConstructor
}