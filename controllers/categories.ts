import { NextFunction, Request, Response } from "express";
import { Filters } from "../types/Filters";
import DB from "../models";
import { FindOptions, Op } from "sequelize";
import { ITransaction } from "../types/ITransaction";
import { UserDto } from "../dto/userDto";
import { ICategory } from "../types/ICategory";

interface ICategoriesGetBody {
  filters?: Filters<ITransaction>,
  startUt?: number,
  endUt?: number,
}

export class CategoriesController {

  public async get(
    req: Request<{}, any, ICategoriesGetBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { startUt, endUt } = req.body;
      const user = req.user as UserDto;
      const options: FindOptions<any> = {};
      const categories: any[] = await DB.Categories.findAll(options);

      if (startUt && endUt) {
        const transactions: any[] = await DB.Transactions.findAll({
          where: {
            userId: user.id,
            date: {
              [Op.gte]: startUt,
              [Op.lte]: endUt
            }
          }
        });

        const categoryMap: Record<string, ICategory> = {};

        categories.forEach(category => {
          categoryMap[category.id] = { ...category.dataValues, sum: 0, count: 0 };
        })

        let expenseAmount = 0;
        let incomeAmount = 0;

        transactions.forEach(transaction => {
          const category = categoryMap[transaction.categoryId];
          const amount = Number(transaction.amount);

          if (transaction.typeId === 1) {
            incomeAmount += amount;
          } else {
            expenseAmount += amount;
          }

          if (category) {
            if (!category.sum) category.sum = 0;
            if (!category.count) category.count = 0;
            category.sum += amount;
            category.count++;
          }
        })

        const categoriesValue = Object.values(categoryMap).map(category => {
          let percentage: number | string = 0;
          let sum = Number(category.sum);
          if (sum < 0 && expenseAmount) {
            percentage = (sum / expenseAmount) * 100;
          } else if (sum > 0 && incomeAmount) {
            percentage = (sum / incomeAmount) * 100;
          }
          percentage = percentage.toFixed(2);

          return {
            ...category,
            percent: percentage
          }
        })

        return res.json(categoriesValue);
      }

      return res.status(200).json(categories);
    } catch (e) {
      next(e);
    }
  }

}
