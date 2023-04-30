import { type WhereOptions, Op } from "sequelize";
import { IFilterComparison, Filters } from "../types/Filters";

function buildSequelizeFilter(filter: IFilterComparison) {
  const sequelizeFilterItem: Record<symbol, any> = {};
  for (const key in filter) {
    const filterValue = filter[key as keyof IFilterComparison];
    const sequelizeFilterKey = Op[key as keyof typeof Op];
    sequelizeFilterItem[sequelizeFilterKey] = filterValue;
  }
  return sequelizeFilterItem;
}

export function buildSequelizeFilters(filters: Filters) {
  const sequelizeFilters: WhereOptions = {}

  for (const key in filters) {
    const filter = filters[key];

    if (Array.isArray(filter)) {
      sequelizeFilters[key] = filter.map(filterItem => {
        const filterFieldValue: Record<string, any> = {};
        for (const key in filterItem) {
          const filter = filterItem[key];
          filterFieldValue[key] = buildSequelizeFilter(filter);
        }
        return filterFieldValue;
      })
    } else {
      sequelizeFilters[key] = buildSequelizeFilter(filter);
    }
  }

  return sequelizeFilters;
}