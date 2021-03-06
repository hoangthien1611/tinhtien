export enum ValidateResult {
  EmptyError = "Must not be empty",
  WhiteSpaceError = "Must not consist of white-space only",
  LongerThan255Error = "Must be less than 255 characters in length",
  ZeroOrNegativeError = "Must be greater than zero",
  NotNumberError = "Must be a number",
  MoreThan2DecimalError = "Must have up to two decimal places",
  AtLeastOnePersonNotPayer = "Please choose at least one person who is not the payer",
  AtLeastOnePerson = "Please choose at least one person",
  GreaterThanError = "Must be less than 1,000,000,000,000,000",
  Ok = ""
}
