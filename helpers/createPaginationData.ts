export function createPaginationData<T>(data: T[], count: number, limit: number) {
  return {
    data,
    count,
    totalPage: Math.ceil(count / limit),
  }
}

module.exports = createPaginationData;