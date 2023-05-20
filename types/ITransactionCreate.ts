export interface ITransactionCreate {
  name: string;
  amount: number;
  typeId: number;
  date: number, // timestamp
  categoryId: number;
}