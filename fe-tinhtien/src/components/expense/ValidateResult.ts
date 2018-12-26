export enum ValidateResult {
  EmptyError = "Must not empty",
  WhiteSpaceError = "Must not consist of white-space only",
  ZeroOrNegativeError = "Must be larger than zero",
  NotNumberError = "Must be a number",
  MoreThan2DecimalError = "Must have up to two decimal places",
  Ok = ""
}
