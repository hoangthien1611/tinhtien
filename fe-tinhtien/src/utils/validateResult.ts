import { ValidateResult } from "../components/expense/ValidateResult";

export function getValidateResult(participantIds: number[], selectedPayerId: number) {
  if (participantIds.length < 1) {
    return ValidateResult.AtLeastOnePerson;
  }
  if (participantIds.length === 1 && participantIds.indexOf(selectedPayerId) > -1) {
    return ValidateResult.AtLeastOnePersonNotPayer;
  }
  return ValidateResult.Ok;
}