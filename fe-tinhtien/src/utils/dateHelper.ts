import * as Moment from "moment"
export function compareDateInYearMonthDay(firstDate: Date, secondDate: Date): number {
  if (firstDate.getFullYear() !== secondDate.getFullYear()) {
    return firstDate.getFullYear() - secondDate.getFullYear();
  }
  if (firstDate.getMonth() !== secondDate.getMonth()) {
    return firstDate.getMonth() - secondDate.getMonth();
  }
  if (firstDate.getDate() !== secondDate.getDate()) {
    return firstDate.getDate() - secondDate.getDate()
  }
  return 0;
}

export function convertUTCToLocalDate(dateUTC: String): Date {
  return Moment.utc(dateUTC.substring(0, 10), "YYYY-MM-DD").local().toDate()
}