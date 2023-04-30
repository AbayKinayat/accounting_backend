export function calcOffset (page: number, limit: number) {
  return page * limit - limit;
}