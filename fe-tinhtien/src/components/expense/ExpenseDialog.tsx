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
import { compareDateInYearMonthDay } from "../../utils/dateHelper";
import { setStorage, getStorage } from "../../utils/localStorage";
import ChooseParticipantInput from "./ChooseParticipantInput";
import { getValidateResult } from "../../utils/validateResult";

export interface ExpenseDialogProps {
  activityUrl: string;
  people: Person[];
  onClose: () => void;
  onSubmit: (
    activityUrl: string,
    name: string,
    amount: number,
    payerId: number,
    createdDate: Date,
    participantIds: number[],
    id?: number,
  ) => void;
  expense?: Expense;
  defaultName?: string;
}

export interface ExpenseDialogState {
  selectedPayerId: number;
  name: string;
  amount: string;
  createdDate: Date;
  nameHasChanged: boolean;
  amountHasChanged: boolean;
  participantIds: number[];
}

export default class ExpenseDialog extends React.Component<ExpenseDialogProps, ExpenseDialogState> {
  constructor(props: ExpenseDialogProps) {
    super(props);
    const expense = props.expense;
    this.state = this.inEditMode() ?
      {
        selectedPayerId: expense!.payer.id,
        name: expense!.name,
        amount: expense!.amount.toString(),
        createdDate: new Date(expense!.date),
        nameHasChanged: false,
        amountHasChanged: false,
        participantIds: this.getListId(expense!.participants)
      } : {
        selectedPayerId: this.getPayerIdByActivityUrl(),
        name: "",
        amount: "",
        createdDate: new Date(),
        nameHasChanged: false,
        amountHasChanged: false,
        participantIds: this.getListId(this.props.people)
      }
  }

  private handleChangeParticipantId = (participantIds: number[]) => {
    this.setState({
      participantIds: participantIds
    });
  }

  private getListId(people?: Person[]): number[] {
    if (people === undefined) {
      return [];
    } else {
      return people.map(person => person.id);
    }
  }

  private handleSubmit = () => {
    this.props.onSubmit(
      this.props.activityUrl,
      this.state.name.trim(),
      Number(this.state.amount.trim()),
      this.state.selectedPayerId,
      this.state.createdDate,
      this.state.participantIds,
      this.props.expense ? this.props.expense.id : undefined);
    this.props.onClose();
    this.setState({ selectedPayerId: this.getPayerIdByActivityUrl() })
    setStorage(this.props.activityUrl, this.state.selectedPayerId.toString());
  };

  private handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let description = event.target.value;
    this.setState({
      name: description,
      nameHasChanged: true
    });
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
    this.setState({
      amount: value,
      amountHasChanged: true
    });
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
    this.setState({ selectedPayerId: parseInt(personId) });
  };

  private handleDateChange = (value: Date) => {
    this.setState({ createdDate: value });
  };

  private getPayerIdByActivityUrl(): number {
    const personId = parseInt(getStorage(this.props.activityUrl) as string);
    if (personId == null) {
      return this.props.people[0].id;
    }
    const person = this.props.people.map(person => person.id).filter(id => id == personId);
    if (person === undefined || person.length == 0)
      return this.props.people[0].id;
    return personId;
  }

  private inEditMode(): boolean {
    return typeof this.props.expense != 'undefined';
  }

  private noChangeInEditMode(): boolean {
    if (!this.inEditMode()) return false;
    const { expense } = this.props;
    const { amount, selectedPayerId, name, createdDate, participantIds } = this.state;
    return expense!.amount === Number(amount.trim()) && compareDateInYearMonthDay(expense!.date, createdDate) === 0
      && expense!.name === name && expense!.payer.id === selectedPayerId
      && this.updateParticipantIds(participantIds, expense!.participants!);
  }

  private updateParticipantIds(participantIds: number[], people: Person[]): boolean {
    return JSON.stringify(people.map(person => person.id).sort()) === JSON.stringify(participantIds.sort());
  }

  render(): React.ReactNode {
    const validateDescriptionResult: ValidateResult = this.validateDescription(this.state.name);
    const validateAmountResult: ValidateResult = this.validateAmount(this.state.amount);
    const validateParticipantIds: ValidateResult = getValidateResult(this.state.participantIds, this.state.selectedPayerId);
    const disableSubmitButton = this.noChangeInEditMode() || validateAmountResult !== ValidateResult.Ok ||
      validateDescriptionResult !== ValidateResult.Ok || validateParticipantIds !== ValidateResult.Ok;
    return (
      <ModalOverlay>
        <ActionContentbox
          headingElements={this.createDialogHeader()}
          footer={this.createDialogFooter(disableSubmitButton)}
        >
          {this.createDialogContent(validateDescriptionResult, validateAmountResult, validateParticipantIds)}
        </ActionContentbox>
      </ModalOverlay>
    );
  }

  private createDialogHeader(): React.ReactNode {
    const title: string = this.props.expense ? appConstant.intro.EXPENSE_EDIT : appConstant.intro.EXPENSE_ADD_NEW;
    return <ContentBoxElements.Title text={title} />
  }

  private createDialogFooter(disableSubmitButton: boolean): React.ReactNode {
    const { onClose } = this.props;
    return (
      <ContentBoxElements.Footer style={{ marginTop: "20px", float: "right" }}>
        <Button
          onClick={this.handleSubmit}
          primary
          className="control-button"
          disabled={disableSubmitButton}
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

  private createDialogContent(validateDescriptionResult: ValidateResult, validateAmountResult: ValidateResult, validateParticipantIdsResult: ValidateResult): React.ReactNode {
    const { people } = this.props;
    const { selectedPayerId, name: description, amount, createdDate: date, participantIds, nameHasChanged, amountHasChanged } = this.state;
    return (
      <>
        <Select
          label={appConstant.intro.EXPENSE_PERSON}
          onValueChanged={this.handlePersonChange}
          value={selectedPayerId.toString()}
        >
          {people.map(person => (
            <Select.Item
              key={person.id}
              label={person.name}
              value={person.id.toString()}
            />
          ))}
        </Select>
        {this.generateEmptyLine(nameHasChanged && validateDescriptionResult !== ValidateResult.Ok)}
        <TextLineStateless
          label={appConstant.intro.EXPENSE_DESCRIPTION}
          placeholder={appConstant.placeholder.EXPENSE_DESCRIPTION}
          onChange={this.handleDescriptionChange}
          value={description}
          errorMessage={this.showErrorMessage(nameHasChanged, validateDescriptionResult)}
        />
        {this.generateEmptyLine(amountHasChanged && validateAmountResult !== ValidateResult.Ok)}
        <TextLineStateless
          label={appConstant.intro.EXPENSE_AMOUNT}
          placeholder={appConstant.placeholder.EXPENSE_AMOUNT}
          onChange={this.handleAmountChange}
          value={amount}
          errorMessage={this.showErrorMessage(amountHasChanged, validateAmountResult)}
        />
        {this.generateEmptyLine(validateParticipantIdsResult !== ValidateResult.Ok)}
        <ChooseParticipantInput
          participantIds={participantIds}
          people={people}
          onChangeParticipantIds={this.handleChangeParticipantId}
          validateResult={validateParticipantIdsResult} />
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

  private showErrorMessage(changed: boolean, validateResult: ValidateResult) {
    return changed && (validateResult !== ValidateResult.Ok) && validateResult;
  }
}