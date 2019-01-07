import React from "react";
import {
  Select,
  TextLineStateless,
  ModalOverlay,
  ActionContentbox,
  ContentBoxElements,
  Button
} from "@com.mgmtp.a12/widgets";
import Person from "../../models/Person";
import DateInput from "./DateInput";
import { ValidateResult } from "./ValidateResult";
import "../../css/expenseDialog.css";
import Expense from "../../models/Expense";
import appConstant from "../../utils/appConstant";

export interface ExpenseDialogProps {
  people: Person[];
  onClose: () => void;
  onSubmit: (
    name: string,
    amount: number,
    personId: number,
    createdDate: Date,
    id?: number,
  ) => void;
  expense?: Expense;
  defaultName?: string;
}

export interface ExpenseDialogState {
  selectedPersonId: number;
  name: string;
  amount: string;
  createdDate: Date;
}

export default class ExpenseDialog extends React.Component<ExpenseDialogProps, ExpenseDialogState> {
  constructor(props: ExpenseDialogProps) {
    super(props);
    const expense = props.expense;
    this.state = expense ?
      {
        selectedPersonId: expense.person.id,
        name: expense.name,
        amount: expense.amount.toString(),
        createdDate: new Date(expense.date)
      } : {
        selectedPersonId: this.getDefaultPersonId(),
        name: "",
        amount: "",
        createdDate: new Date()
      }
  }

  private getDefaultPersonId(): number {
    const { people, defaultName } = this.props;
    for (const i in people) {
      if (people[i].name === defaultName) return people[i].id;
    }
    return this.props.people[0].id;
  }

  private handleSubmit = () => {
    this.props.onSubmit(
      this.state.name.trim(),
      Number(this.state.amount.trim()),
      this.state.selectedPersonId,
      this.state.createdDate,
      this.props.expense ? this.props.expense.id : undefined);
    this.props.onClose();
  };

  private handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let description = event.target.value;
    this.setState({ name: description });
  };

  private validateDescription(description: string): ValidateResult {
    if (description.length === 0) return ValidateResult.EmptyError;
    const actualLength = description.trim().length
    if (actualLength === 0) return ValidateResult.WhiteSpaceError;
    if (actualLength > 255) return ValidateResult.LongerThan255Error;
    return ValidateResult.Ok;
  }

  private handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    this.setState({ amount: value });
  };

  private validateAmount(amount: string): ValidateResult {
    if (amount.length === 0) return ValidateResult.EmptyError;
    const trimedAmount = amount.trim()
    if (trimedAmount.length === 0) return ValidateResult.WhiteSpaceError;
    const amountNumber = Number(trimedAmount);
    if (isNaN(amountNumber) || !trimedAmount.match(/^-?\d*(\.\d*)?$/))
      return ValidateResult.NotNumberError;
    if (amountNumber <= 0) return ValidateResult.ZeroOrNegativeError;
    if (!trimedAmount.match(/^\d*(\.\d{0,2})?$/))
      return ValidateResult.MoreThan2DecimalError;
    return ValidateResult.Ok;
  }

  private handlePersonChange = (personId: string) => {
    this.setState({ selectedPersonId: (personId as any) as number });
  };

  private handleDateChange = (value: Date) => {
    this.setState({ createdDate: value });
  };

  render(): React.ReactNode {
    const validateDescriptionResult: ValidateResult = this.validateDescription(this.state.name);
    const validateAmountResult: ValidateResult = this.validateAmount(this.state.amount);

    return (
      <ModalOverlay>
        <ActionContentbox
          headingElements={this.createDialogHeader()}
          footer={this.createDialogFooter(validateAmountResult !== ValidateResult.Ok ||
            validateDescriptionResult !== ValidateResult.Ok)}
        >
          {this.createDialogContent(validateDescriptionResult, validateAmountResult)}
        </ActionContentbox>
      </ModalOverlay>
    );
  }

  private createDialogHeader(): React.ReactNode {
    const title: string = this.props.expense ? appConstant.intro.EXPENSE_EDIT : appConstant.intro.EXPENSE_ADD_NEW;
    return <ContentBoxElements.Title text={title} />
  }

  private createDialogFooter(showSubmitbutton: boolean): React.ReactNode {
    const { onClose } = this.props;
    return (
      <ContentBoxElements.Footer style={{ marginTop: "20px", float: "right" }}>
        <Button
          onClick={this.handleSubmit}
          primary
          className="control-button"
          disabled={showSubmitbutton}
        >
          Ok
        </Button>
        <Button
          onClick={onClose}
          destructive
          primary
          className="control-button"
        >
          Cancel
        </Button>
      </ContentBoxElements.Footer>
    );
  }

  private createDialogContent(validateDescriptionResult: ValidateResult, validateAmountResult: ValidateResult): React.ReactNode {
    const { people } = this.props;
    const { selectedPersonId, name: description, amount, createdDate: date } = this.state;
    return (
      <>
        <Select
          label={appConstant.intro.EXPENSE_PERSON}
          onValueChanged={this.handlePersonChange}
          value={selectedPersonId.toString()}
        >
          {people.map(person => (
            <Select.Item
              key={person.id}
              label={person.name}
              value={person.id.toString()}
            />
          ))}
        </Select>
        {this.generateEmptyLine(validateDescriptionResult !== ValidateResult.Ok)}
        <TextLineStateless
          label={appConstant.intro.EXPENSE_DESCRIPTION}
          placeholder={appConstant.placeholder.EXPENSE_DESCRIPTION}
          onChange={this.handleDescriptionChange}
          value={description}
          errorMessage={validateDescriptionResult !== ValidateResult.Ok && validateDescriptionResult}
        />
        {this.generateEmptyLine(validateAmountResult !== ValidateResult.Ok)}
        <TextLineStateless
          label={appConstant.intro.EXPENSE_AMOUNT}
          placeholder={appConstant.placeholder.EXPENSE_AMOUNT}
          onChange={this.handleAmountChange}
          value={amount}
          errorMessage={validateAmountResult !== ValidateResult.Ok && validateAmountResult}
        />
        {this.generateEmptyLine(false)}
        <DateInput onChange={this.handleDateChange} selectedDate={date} />
      </>
    );
  }

  private generateEmptyLine(hidden: boolean) {
    return (
      <div className="field__message" hidden={hidden}>
        <div className="field__messageIcon"><i className="plasma-icon">_</i></div>
        <div className="field__messageText"></div>
      </div>
    )
  }
}