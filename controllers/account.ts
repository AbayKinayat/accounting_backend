import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/IUser";
import DB from "../models";
import ApiError from "../exceptions/api-error";

export class AccountController {

  async updateCash(req: Request<{}, { cash?: number }>, res: Response, next: NextFunction) {
    try {
      const { cash } = req.body;

      if (cash === undefined || Number.isNaN(Number(cash))) {
        throw ApiError.BadRequest("Не корректное значение");
      }

      const user = req.user as IUser;

      const currentUser: any = await DB.Users.findByPk(user.id);

      if (currentUser) {
        currentUser.cash = cash;
        currentUser?.save();
      }

      return res.status(200).json({ message: "Вы успешно изменили счет" })
    } catch (e) {
      next(e);
    }
  }

}
