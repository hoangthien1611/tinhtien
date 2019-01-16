import { addData, getData, updateData, deleteData } from "../utils/apiCaller"
import Expense from "../models/Expense"
import { convertUTCToLocalDate } from "../utils/dateHelper";
const baseUrl = "api/expense/";

export const addExpense = (activityUrl: string, name: string, amount: number, payerId: number, createdDate: Date, participantIds: number[],
  onSuccess: (expenses: Expense) => void,
  onFailure: (errorMessage: string) => void,
  onFinal?: () => void) => {
  addData(baseUrl, {
    "activityUrl": activityUrl,
    "payerId": payerId,
    "name": name,
    "amount": amount,
    "createdDate": createdDate,
    "participantIds": participantIds
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

export const editExpense = (activityUrl: string, id: number, name: string, amount: number, payerId: number, participantIds: number[], createdDate: Date,
  onSuccess: (expenses: Expense) => void,
  onFailure: (errorMessage: string) => void,
  onFinal?: () => void) => {
  updateData(baseUrl, {
    "id": id,
    "name": name,
    "payerId": payerId,
    "amount": amount,
    "createdDate": createdDate,
    "activityUrl": activityUrl,
    "participantIds": participantIds
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
  const person = { id: jsonObject.payer.id, name: jsonObject.payer.name, active: jsonObject.payer.active }
  const createdDate = convertUTCToLocalDate(jsonObject.createdDate)
  return {
    id: jsonObject.id,
    name: jsonObject.name,
    payer: person,
    amount: jsonObject.amount,
    date: createdDate,
    participants: jsonObject.participants
  };
}
