import { IUser } from "../types/IUser";

export class UserDto {
  id: number = 1;
  username: string = "";
  cash: number = 0;
  createdAt: string

  constructor(user: IUser) {
    this.id = user.id;
    this.username = user.username;
    this.cash = user.cash;
    this.createdAt = user.createdAt;
  }
}