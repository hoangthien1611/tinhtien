import React from "react"
import { Select, TextLineStateless, ModalOverlay, ActionContentbox, ContentBoxElements, Button } from "@com.mgmtp.a12/widgets";
import Person from "../../models/Person"
import DateInput from "./DateInput";
import { ValidateResult } from "./ValidateResult"
import "../../css/addExpenseDialog.css"

interface AddExpenseDialogState {
  selectedPersonId: number,
  description: string,
  amount: string,
  date: Date,
}

interface AddExpenseDialogProps {
  people: Person[],
  defaultName?: string,
  onAddExpense: (selectedPersonId: number, description: string, amount: number, date: Date) => void,
  onClose: () => void
}

export default class AddExpenseDialog extends React.Component<AddExpenseDialogProps, AddExpenseDialogState>{
  private validateDescriptionResult: ValidateResult
  private validateAmountResult: ValidateResult

  constructor(props: AddExpenseDialogProps) {
    super(props);
    this.state = {
      selectedPersonId: this.getDefaultId(props.people, props.defaultName),
      description: "",
      amount: "",
      date: new Date(),
    };
    this.validateDescriptionResult = ValidateResult.EmptyError;
    this.validateAmountResult = ValidateResult.EmptyError;
  }

  private addExpense = () => {
    this.props.onAddExpense(this.state.selectedPersonId, this.state.description,
      Number(this.state.amount), this.state.date);
    this.props.onClose()
  }

  private handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let description = event.target.value
    this.validateDescriptionResult = this.validateDescription(description)
    this.setState({ description })
  }

  private validateDescription(description: string): ValidateResult {
    if (description.length === 0) return ValidateResult.EmptyError;
    if (description.trim().length === 0) return ValidateResult.WhiteSpaceError;
    return ValidateResult.Ok;
  }

  private handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    this.validateAmountResult = this.validateAmount(value)
    this.setState({ amount: value })
  }

  private validateAmount(amount: string): ValidateResult {
    if (amount.length === 0) return ValidateResult.EmptyError;
    let amountNumber = Number(amount);
    if (isNaN(amountNumber) || !amount.match(/^-?\d*(\.\d*)?$/)) return ValidateResult.NotNumberError;
    if (amountNumber <= 0) return ValidateResult.ZeroOrNegativeError;
    if (!amount.match(/^\d*(\.\d{0,2})?$/)) return ValidateResult.MoreThan2DecimalError;
    return ValidateResult.Ok
  }

  private handlePersonChange = (personId: string) => {
    this.setState({ selectedPersonId: personId as any as number });
  }

  private handleDateChange = (value: Date) => {
    this.setState({ date: value })
  }

  private getDefaultId(people: Person[], defaultName?: string): number {
    for (const i in people) {
      if (people[i].name === defaultName) return people[i].id;
    }
    return people[0].id;
  }

  render(): React.ReactNode {
    return (
      <ModalOverlay>
        <ActionContentbox
          headingElements={<ContentBoxElements.Title text="Add a new expense" />}
          footer={this.createFormFooter()}
        >
          {this.createFormContent()}
        </ActionContentbox>
      </ModalOverlay>
    )
  }

  private createFormFooter(): React.ReactNode {
    const { onClose } = this.props
    return (
      <ContentBoxElements.Footer style={{ marginTop: '20px', float: 'right' }}>
        <Button onClick={this.addExpense} primary className="control-button"
          disabled={this.validateAmountResult !== ValidateResult.Ok || this.validateDescriptionResult !== ValidateResult.Ok}>
          Ok
        </Button>
        <Button onClick={onClose} destructive primary className="control-button">Cancel</Button>
      </ContentBoxElements.Footer>
    )
  }

  private createFormContent(): React.ReactNode {
    const { people } = this.props
    const { selectedPersonId, description, amount, date } = this.state
    return (
      <>
        <Select
          className="padding-bot-10"
          label="Paid by:"
          onValueChanged={this.handlePersonChange}
          value={selectedPersonId.toString()}
        >
          {
            people.map((person) => {
              <> <Select.Item label={person.name} value={person.id.toString()} /> </>
            })
          }
        </Select>
        <TextLineStateless
          className="padding-bot-10"
          label="Paid for:"
          placeholder="Description"
          onChange={this.handleDescriptionChange}
          value={description}
          errorMessage={this.validateDescriptionResult === ValidateResult.Ok ?
            undefined : this.validateDescriptionResult} />
        <TextLineStateless
          className="padding-bot-10"
          label="Amount of money:"
          placeholder="Amount"
          onChange={this.handleAmountChange}
          value={amount}
          errorMessage={this.validateAmountResult === ValidateResult.Ok ?
            undefined : this.validateAmountResult} />
        <DateInput onChange={this.handleDateChange} selectedDate={date} />
      </>
    )
  }
}
