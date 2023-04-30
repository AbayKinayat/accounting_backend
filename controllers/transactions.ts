import { NextFunction, Request, Response } from "express";
import DB from "../models";
import { UserDto } from "../dto/userDto";
import ApiError from "../exceptions/api-error";
import { calcOffset } from "../helpers/calcOffset";
import { createPaginationData } from "../helpers/createPaginationData";

interface TransactionGetBody {
  page: number,
  limit: number,
  filter: {
    typeId?: number,
    categoryId?: number,
    name?: string
  }
}

export class TransactionsController {

  public async post(
    req: Request<ParamsDictionary, any, any> & { user: UserDto },
    res: Response,
    next: NextFunction
  ) {
    try {
      

      if (req.query.page && req.query.limit) {
        const offset = calcOffset(Number(req.query.page), Number(req.query.limit));
        const transactions = await DB.Transactions.findAndCountAll({
          limit: Number(req.query.limit),
          offset,
          where: {
            userId: req.user.id
          }
        });

        const paginatedData = createPaginationData(transactions.rows, transactions.count, Number(req.query.limit));

        return res.json(paginatedData);

      }

      throw ApiError.BadRequest("page or perPage not found");

    } catch (e) {
      next(e);
    }
  }

  getById() {

  }

  remove() {

  }

  create() {

  }


}