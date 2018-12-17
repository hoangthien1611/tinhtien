export function checkValidActivityName(trimmedInput: string) {
  if (trimmedInput.length == 0) {
    return ValidActivityResult.EmptyError;
  }
  return ValidActivityResult.Ok;
}


export enum ValidActivityResult {
  EmptyError = "The name must not be empty or whitespace-only",
  Ok = "",
}
