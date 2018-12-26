import Person from "./Person";

export default interface Expense {
  id:number;
  person: Person;
  name: string;
  amount: number;
}
