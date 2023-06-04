export function getStatisticDateKey(date: Date) {
  return `${date.getFullYear()} ${date.getMonth()} ${date.getDate()}`;
}