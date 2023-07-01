import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/IUser";
import DB from "../models";

interface IBudget {
  amount: number,
  categoryId: 1
}

export class BudgetController {

  async update(req: Request<{}, {}, IBudget>, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const { amount, categoryId } = req.body;

      const budget: any = await DB.Budget.findOne({
        where: {
          userId: user.id,
          categoryId: categoryId
        }
      })

      if (budget) {
        budget.amount = amount;
        await budget.save();
        return res.status(200).json({ message: "success" });
      } else {
        const newBudget = await DB.Budget.create({
          userId: user.id,
          categoryId: categoryId,
          amount
        })

        res.status(201).json(newBudget);
      }

    } catch (e) {
      next(e);
    }
  }

}
