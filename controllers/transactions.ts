import { NextFunction, Request, Response } from "express";
import DB from "../models";
import type { UserDto } from "../dto/userDto";
import ApiError from "../exceptions/api-error";
import { calcOffset } from "../helpers/calcOffset";
import { createPaginationData } from "../helpers/createPaginationData";
import { WhereOptions } from "sequelize";
import type { Filters } from "../types/Filters";
import { buildSequelizeFilters } from "../helpers/buildSequelizeFilters";
import { ITransactionCreate } from "../types/ITransactionCreate";
import { ITransaction } from "../types/ITransaction";

interface TransactionGetBody {
  page: number,
  limit: number,
  filters?: Filters
}

export class TransactionsController {

  public async get(
    req: Request<{}, any, TransactionGetBody, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit, filters } = req.body;
      const user = req.user as UserDto;

      if (page && limit) {
        let where: WhereOptions = {
          userId: user.id
        };
        if (filters)
          where = Object.assign(buildSequelizeFilters(filters), where);

        const offset = calcOffset(page, limit);
        const transactions = await DB.Transactions.findAndCountAll({
          limit,
          offset,
          where
        });

        const paginatedData = createPaginationData(transactions.rows, transactions.count, limit);

        return res.status(200).json(paginatedData);
      }

      throw ApiError.BadRequest("page or perPage not found");

    } catch (e) {
      next(e);
    }
  }

  public async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transaction = await DB.Transactions.findOne({
        where: {
          userId: req.user?.id,
          id: Number(req.params.id)
        },
        include: {
          all: true
        }
      });

      return res.json(transaction);
    } catch (e) {
      next(e);
    }
  }

  public async remove(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const transaction = await DB.Transactions.findByPk(Number(req.params.id));

      await transaction?.destroy();

      return res.json(transaction);
    } catch (e) {
      next(e);
    }
  }

  public async create(
    req: Request<{}, any, ITransactionCreate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        amount,
        categoryId,
        name,
        typeId
      } = req.body;

      const transaction = await DB.Transactions.create({
        userId: req.user?.id,
        amount,
        categoryId,
        name,
        typeId
      }, { include: { all: true } });

      return res.status(201).json(transaction);
    } catch (e) {
      next(e);
    }
  }

  public async edit(
    req: Request<{ id: string }, any, ITransaction>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { } = req.body;

      const accessProps = ["name", "categoryId", "typeId", "amount", "createdAt", "updatedAt"];
      const data: Partial<ITransactionCreate> & { createdAt?: string, updatedAt?: string } = {};

      for (const key in req.body) {
        const value = req.body[key as keyof ITransaction];
        if (accessProps.includes(key)) {
          data[key as keyof typeof data] = value as any;
        }
      }

      await DB.Transactions.update(data, {
        where: {
          id: req.params.id,
          userId: req.user?.id
        },
      });

      const transaction = await DB.Transactions.findByPk(Number(req.params.id), {
        include: { all: true }
      });

      return res.json(transaction);
    } catch (e) {
      next(e);
    }
  }
}