import Person from "./Person";

export interface OutstandingPayment {
    paidPerson: Person;
    receivedPerson: Person;
    money: number;
}