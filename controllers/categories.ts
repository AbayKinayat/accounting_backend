import { NextFunction, Request, Response } from "express";
import { Filters } from "../types/Filters";
import DB from "../models";
import { FindOptions } from "sequelize";
import { buildSequelizeFilters } from "../helpers/buildSequelizeFilters";
import { ITransaction } from "../types/ITransaction";

interface ICategoriesGetBody {
  filters?: Filters<ITransaction>
}

export class CategoriesController {

  public async get(
    req: Request<{}, any, ICategoriesGetBody>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const options: FindOptions<any> = {  };

      if (req.body.filters)  {
        options.where = buildSequelizeFilters(req.body.filters);
      } 

      const categories = await DB.Categories.findAll(options);

      return res.status(200).json(categories);
    } catch(e) {
      next(e);
    }
  }

}
