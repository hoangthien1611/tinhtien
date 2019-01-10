import Person from "./Person";

export default interface Balance {
  person: Person,
  paid: number,
  shouldPay: number,
  payBack: number
}
