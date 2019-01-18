import { addData, getData, updateData, deleteData } from "../utils/apiCaller"
import Expense from "../models/Expense"
import { convertUTCToLocalDate } from "../utils/dateHelper";
const baseUrl = "api/expense/";

export const addExpense = (name: string, amount: number, personId: number, createdDate: Date,
  onSuccess: (expenses: Expense) => void,
  onFailure: (errorMessage: string) => void,
  onFinal?: () => void) => {
  addData(baseUrl, {
    "personId": personId,
    "name": name,
    "amount": amount,
    "createdDate": createdDate
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
  getData(baseUrl + activityUrl).then(
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

export const editExpense = (id: number, name: string, amount: number, personId: number, createdDate: Date,
  onSuccess: (expenses: Expense) => void,
  onFailure: (errorMessage: string) => void,
  onFinal?: () => void) => {
  updateData(baseUrl, {
    "id": id,
    "name": name,
    "personId": personId,
    "amount": amount,
    "createdDate": createdDate
  }).then(
    jsonResult => {
      if (jsonResult.error) {
        onFailure(jsonResult.message);
      } else {
        onSuccess(parserTo(jsonResult));
      }
      if (onFinal) {
        onFinal();
      }
    }
  )
}
export const deleteExpense = (id: number,
  onSuccess: (message: string) => void,
  onFailure: (errorMessage: string) => void
) => {
  deleteData(baseUrl + id)
    .then(
      jsonResult => {
        if (jsonResult.error) {
          onFailure(jsonResult.message);
        } else onSuccess(jsonResult.message);
      }
    )
}

function parserTo(jsonObject: any): Expense {
  const person = { id: jsonObject.person.id, name: jsonObject.person.name, active: jsonObject.person.active }
  const createdDate = convertUTCToLocalDate(jsonObject.createdDate)
  return {
    id: jsonObject.id,
    name: jsonObject.name,
    person: person,
    amount: jsonObject.amount,
    date: createdDate
  };
}
