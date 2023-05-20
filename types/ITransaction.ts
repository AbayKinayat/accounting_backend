import { ITransactionCreate } from "./ITransactionCreate";

export interface ITransaction extends ITransactionCreate {
  id: number, 
  date: number,
  userId: number,
  createdAt: string;
  updatedAt: string;
}