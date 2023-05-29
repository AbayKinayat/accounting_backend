import { NextFunction, Request, Response } from "express";
import DB, { sequelize } from "../models";
import type { UserDto } from "../dto/userDto";
import ApiError from "../exceptions/api-error";
import { calcOffset } from "../helpers/calcOffset";
import { createPaginationData } from "../helpers/createPaginationData";
import { FindAndCountOptions, WhereOptions, Op } from "sequelize";
import type { Filters } from "../types/Filters";
import { buildSequelizeFilters } from "../helpers/buildSequelizeFilters";
import { ITransactionCreate } from "../types/ITransactionCreate";
import { ITransaction } from "../types/ITransaction";
import { sort } from "../enum/sort";
import { ChartType } from "../types/ChartType";

interface TransactionGetBody {
  page: number,
  limit: number,
  filters?: Filters,
  sortField?: string,
  sortOrder?: number
}

interface GetStatisticBody {
  startUt: number,
  endUt: number,
  typeId?: number,
  chartType?: ChartType
}

type YearFilter = "year" | "month" | "week";

export class TransactionsController {

  public async get(
    req: Request<{}, any, TransactionGetBody, {}>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { page, limit, filters, sortField, sortOrder } = req.body;
      const user = req.user as UserDto;

      if (page && limit) {
        const options: Omit<FindAndCountOptions, 'group'> = {
          limit,
          where: {
            userId: user.id
          },
          include: { all: true }
        }
        if (filters)
          options.where = Object.assign(buildSequelizeFilters(filters), options.where);
        if (sortField && sortOrder) {
          options.order = [
            [sortField, sort[String(sortOrder) as keyof typeof sort]]
          ]
        }

        options.offset = calcOffset(page, limit);
        const transactions = await DB.Transactions.findAndCountAll(options);

        const paginatedData = createPaginationData(transactions.rows, transactions.count, limit);

        return res.status(200).json(paginatedData);
      }

      throw ApiError.BadRequest("page or limit not found");

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
        date,
        typeId
      } = req.body;

      const transaction = await DB.Transactions.create({
        userId: req.user?.id,
        amount,
        categoryId,
        date,
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

      const accessProps = ["name", "categoryId", "typeId", "amount", "date"];
      const data: Partial<ITransactionCreate> = {};

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

  public async getStatistic(req: Request<{}, any, GetStatisticBody>, res: Response, next: NextFunction) {
    try {
      const { startUt, endUt, typeId, chartType = "dynamic" } = req.body;

      const where: WhereOptions = {
        date: {
          [Op.gte]: startUt,
          [Op.lte]: endUt
        }
      }

      if (typeId) where.typeId = typeId;

      const transactions: any[] = await DB.Transactions.findAll({
        where
      })
      const categories: any[] = await DB.Categories.findAll();

      const start = new Date(startUt * 1000);
      const end = new Date(endUt * 1000);

      if (chartType === "dynamic") {
        const categoryIds: Record<string, number> = {};
        categories.forEach(category => categoryIds[category.id] = 0);
        if (end.getMonth() > start.getMonth() || end.getFullYear() > start.getFullYear()) {
          const months = [
            {
              name: "Январь",
              value: 0,
              ...categoryIds
            },
            {
              name: "Февраль",
              value: 0,
              ...categoryIds
            },
            {
              name: "Март",
              value: 0,
              ...categoryIds
            },
            {
              name: "Апрель",
              value: 0,
              ...categoryIds
            },
            {
              name: "Май",
              value: 0,
              ...categoryIds
            },
            {
              name: "Июнь",
              value: 0,
              ...categoryIds
            },
            {
              name: "Июль",
              value: 0,
              ...categoryIds
            },
            {
              name: "Август",
              value: 0,
              ...categoryIds
            },
            {
              name: "Сентябрь",
              value: 0,
              ...categoryIds
            },
            {
              name: "Октябрь",
              value: 0,
              ...categoryIds
            },
            {
              name: "Ноябрь",
              value: 0,
              ...categoryIds
            },
            {
              name: "Декабрь",
              value: 0,
              ...categoryIds
            }
          ]

          transactions.forEach((transaction: any) => {
            const date = new Date(transaction.date * 1000);
            const monthIndex = date.getMonth();
            const month: any = months[monthIndex]

            month.value += Math.abs(Number(transaction.amount));
            if (transaction.categoryId) month[transaction.categoryId] += Math.abs(Number(transaction.amount));
          })

          return res.json(
            months
          );
        } else {
          const month = start.getMonth();
          const daysDate = new Date(start.getFullYear(), month + 1, 0);
          const days = daysDate.getDate();
          const data: { [key: string]: any } = {};

          for (let day = 1; day <= days; day++) {
            if (day >= start.getDate() && day <= end.getDate()) {
              data[day] = {
                name: String(day),
                value: 0,
                ...categoryIds
              }
            }
          }

          transactions.forEach((transaction: any) => {
            const date = new Date(transaction.date * 1000);
            const day = date.getDate();

            if (data[day]) {
              data[day].value += Math.abs(Number(transaction.amount));
              if (transaction.categoryId) data[day][transaction.categoryId] += Math.abs(Number(transaction.amount));
            }
          })

          return res.json(Object.values(data));
        }
      } else if (chartType === "review") {
        const categoriesMap: Record<string, { name: string, value: number, id: number }> = {};

        categories.forEach(category => {
          categoriesMap[category.id] = {
            id: category.id,
            name: category.name,
            value: 0
          }
        })

        transactions.forEach(transaction => {
          if (categoriesMap[transaction.categoryId]) {
            categoriesMap[transaction.categoryId].value += Math.abs(Number(transaction.amount));
          }
        })

        return res.json(Object.values(categoriesMap));
      }



    } catch (e) {
      next(e);
    }
  }
}