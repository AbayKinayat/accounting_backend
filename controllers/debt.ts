import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/IUser";
import DB, { sequelize } from "../models";
import ApiError from "../exceptions/api-error";
import { DebtStatus } from "../enum/DebtStatus";

interface IDebtCreate {
  sum: number,
  amountPaid: number,
  isPaid: boolean,
  name: string,
  description: string,
  isDebtor: boolean,
  dateFrom: number,
  dateTo: number,
  isCashChange: boolean,
  statusId: number
}

export class DebtController {

  async create(req: Request<{}, {}, IDebtCreate>, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;
      const {
        amountPaid, dateFrom, dateTo, description, isDebtor, isPaid, name, sum, statusId, isCashChange
      } = req.body;

      const debt = DB.Debt.create({ amountPaid, dateFrom, dateTo, description, isDebtor, isPaid, name, sum, statusId, userId: user.id });

      if (isCashChange && statusId === DebtStatus.OPEN) {
        const dbUser: any = await DB.Users.findByPk(user.id);

        dbUser.cash = this.calcUserCash(dbUser.cash, sum, isDebtor);
        dbUser?.save()
      }

      return res.status(201).json(debt);
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request<{ id?: number }, {}, Partial<IDebtCreate>>, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;

      const isCashChange = req.body.isCashChange;
      const debt: any = await DB.Debt.findByPk(req.params.id);
      
      const statusId = req.body.statusId || debt.statusId;

      delete req.body.isCashChange

      const t = await sequelize.transaction();

      // calc user cash 
      if (isCashChange && (req.body.sum || typeof req.body.isDebtor === "boolean") && statusId === DebtStatus.OPEN) {
        const dbUser: any = await DB.Users.findByPk(user.id);

        let initialCash = Number(dbUser.cash) + Number(debt.sum);

        if (debt.isDebtor) {
          initialCash = Number(dbUser.cash) - Number(debt.sum);
        }

        const isDebtor = req.body.isDebtor || debt.isDebtor;
        const sum = req.body.sum || debt.sum;

        dbUser.cash = this.calcUserCash(initialCash, sum, isDebtor);
      }

      DB.Debt.update({ ...req.body }, {
        where: { id: req.params.id, userId: user.id }
      });

      t.commit();

      return res.status(200).json({ message: "success" });
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as IUser;

      const debts = DB.Debt.findAll({
        where: {
          userId: user.id
        }
      });

      return debts;
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request<{ id?: number }>, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const user = req.user as IUser;

      const debt: any = await DB.Debt.findOne({ 
        where: {
          id,
          userId: user.id
        }
      });

      if (debt.statusId === DebtStatus.OPEN) {
        const dbUser: any = await DB.Users.findByPk(user.id);
        
        let cash = Number(dbUser.cash) + Number(debt.sum);
        
        if (debt.isDebtor) {
          cash = Number(dbUser.cash) - Number(debt.sum);
        }

        dbUser.cash = cash;
        dbUser.save();
      }

      await debt?.destroy();

      return res.status(202).json({ message: "success" });

    } catch(e) {
      next(e);
    }
  }

  calcUserCash(cash: number, sum: number, isDebtor: boolean) {
    let actualCash = cash - Number(sum);

    if (isDebtor) {
      actualCash  = cash + Number(sum);
    }

    return actualCash;
  }

}
