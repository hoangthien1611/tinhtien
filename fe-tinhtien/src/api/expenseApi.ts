import { addData, getData } from "../utils/apiCaller"
import Expense from "../models/Expense"

const baseUrl = "/api/expense";

export const addExpense = (selectedPerson: number, description: string, amount: number, date: Date,
  onSuccess: (expenses: Expense) => void,
  onFailure: (errorMessage: string) => void,
  onFinal?: () => void) => {
  addData(baseUrl, {
    "personId": selectedPerson,
    "name": description,
    "amount": amount,
    "createdDate": date
  }).then(jsonResult => {
    if (jsonResult.error) {
      onFailure(jsonResult.message);
    } else {
      onSuccess(parserTo(jsonResult));
    }
    if (onFinal) {
      onFinal();
    }
  })
}

export const getExpenses = (activityUrl: string,
  onSuccess: (expenses: Expense[]) => void,
  onFailure: (errorMessage: string) => void,
  onFinal?: () => void) => {
  getData(baseUrl + "/" + activityUrl).then(
    jsonResult => {
      if (jsonResult.error) {
        onFailure(jsonResult.message);
      } else {
        const expenses: Expense[] = [];
        for (const i in jsonResult) {
          expenses.push(parserTo(jsonResult[i]))
        }
        onSuccess(expenses);
      }

      if (onFinal) {
        onFinal();
      }
    }
  )
}

function parserTo(jsonObject: any): Expense {
  const person = { id: jsonObject.person.id, name: jsonObject.person.name, active: jsonObject.person.active }
  return {
    id: jsonObject.id,
    name: jsonObject.name,
    person: person,
    amount: jsonObject.amount,
    date: jsonObject.createdDate
  };
}
