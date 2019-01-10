import { getData } from "../utils/apiCaller";
import Balance from "../models/Balance";
const baseUrl = "api/balance/";
export const getBalance = (activityUrl: string,
  onSuccess: (balances: Balance[]) => void,
  onFailure: (errorMessage: string) => void, ) => {
  return getData(baseUrl + activityUrl).then(
    jsonResult => {
      if (jsonResult.error) {
        onFailure(jsonResult.errorMessage);
      } else {
        onSuccess(jsonResult as Balance[]);
      }
    }
  )
}
