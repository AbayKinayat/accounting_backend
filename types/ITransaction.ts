export interface ITransaction {
  id: number, 
  name: string;
  amount: number;
  typeId: number;
  userId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}