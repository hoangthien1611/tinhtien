export function compareDateInYearMonthDay(firstDate: Date, secondDate: Date): number {
  return firstDate.toString().substring(0, 10).
    localeCompare(secondDate.toString().substring(0, 10))
}
