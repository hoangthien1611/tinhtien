import Person from "./Person";

export default interface Expense {
  id: number;
  payer: Person;
  name: string;
  amount: number;
  date: Date;
  participants?: Person[]
}
