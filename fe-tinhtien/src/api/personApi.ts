import { getData } from "../utils/apiCaller";
import Person from "../models/Person";

const url = "api/person/"
export const getPersons = (activityUrl: string, onSuccess: (persons: Person[]) => void,
  onFailure: (errorMessage: string) => void,
  onFinal?: () => void) => {
  getData(url + activityUrl).then(
    jsonResult => {
      if (jsonResult.error) {
        onFailure(jsonResult.message);
      } else {
        onSuccess(jsonResult as Person[]);
      }
      if (onFinal) {
        onFinal();
      }
    }
  )
}
