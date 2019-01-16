import React from "react";
import {
  List,
  Checkbox,
  Radio,
  TextLineStateless,
  Button,
  Icon
} from "@com.mgmtp.a12/widgets";
import { ValidateResult } from "./ValidateResult";
import Person from "../../models/Person";
import appConstant from "../../utils/appConstant";
import "../../css/chooseParticipantInput.css";

interface ChooseParticipantInputProps {
  selectedPayerId: number;
  people: Person[];
  participantIds: number[];
  onChangeParticipantIds: (participantIds: number[]) => void;
}

interface ChooseParticipantInputState {
  validateResult: string;
  selectAllParticipant: string;
  nameParticipantInput: string;
  participantsInput: Person[];
}

export default class ChooseParticipantInput extends React.Component<
  ChooseParticipantInputProps,
  ChooseParticipantInputState
  > {
  constructor(props: ChooseParticipantInputProps) {
    super(props);
    this.state = {
      validateResult: this.getValidateResult(this.props.participantIds, this.props.selectedPayerId),
      selectAllParticipant: this.props.participantIds.length === this.props.people.length ? "all" : "another",
      nameParticipantInput: "",
      participantsInput: props.people
    }
  }
  private getListPerson = (people: Person[]): React.ReactNode => {
    return people.map(person => {
      return (
        <List.Item key={person.id} text={
          <Checkbox
            checked={this.props.participantIds.indexOf(person.id) > -1}
            onChange={checked => this.handleChangeCheckboxIdPerson(checked, person.id)}
            label={person.name} />
        } />
      );
    })
  }

  private handleChangeCheckboxIdPerson(checked: boolean, idPerson: number): void {
    const { participantIds } = this.props;
    const { selectedPayerId } = this.props;
    let validateResult = ValidateResult.Ok;
    if (checked && participantIds.indexOf(idPerson) == -1) {
      participantIds.push(idPerson);
    }
    if (!checked && participantIds.indexOf(idPerson) > -1) {
      participantIds.splice(participantIds.indexOf(idPerson), 1);
    }
    if (participantIds.length == 1 && participantIds.indexOf(selectedPayerId) > -1 ||
      participantIds.length == 0) {
      validateResult = ValidateResult.AtLeastOnePersonNotPayer;
    }
    this.setState({
      validateResult: validateResult
    });
    this.props.onChangeParticipantIds(participantIds);
  }

  private handleSelectPersonChanged(value: string, people: Person[]): void {
    let validateResult = ValidateResult.Ok;
    if (value === "another") {
      this.props.onChangeParticipantIds([]);
      validateResult = ValidateResult.AtLeastOnePersonNotPayer;
    } else {
      this.props.onChangeParticipantIds(people.map(person => person.id));
      validateResult = ValidateResult.Ok;
    }
    this.setState({
      selectAllParticipant: value,
      validateResult: validateResult
    });
  }

  private handleSelectAllParticipantIds = (): void => {
    const { participantsInput } = this.state;
    const { selectedPayerId, participantIds } = this.props;
    let newParticipantIds: number[] = participantIds;
    participantsInput.map(person => {
      if (newParticipantIds.indexOf(person.id) === -1) {
        newParticipantIds.push(person.id);
      }
    });
    this.props.onChangeParticipantIds(newParticipantIds);
    this.setState({
      validateResult: this.getValidateResult(newParticipantIds, selectedPayerId)
    });
  }

  private getValidateResult(participantIds: number[], selectedPayerId: number) {
    if (participantIds.length < 1 ||
      participantIds.length === 1 && participantIds.indexOf(selectedPayerId) > -1) {
      return ValidateResult.AtLeastOnePersonNotPayer
    } else {
      return ValidateResult.Ok
    }
  }

  private handleUnSelectAllParticipantIds = (): void => {
    const { participantsInput } = this.state;
    const { participantIds, selectedPayerId } = this.props;
    let newParticipantIds: number[] = participantIds;
    participantsInput.map(person => {
      if (newParticipantIds.indexOf(person.id) > -1) {
        newParticipantIds.splice(newParticipantIds.indexOf(person.id), 1);
      }
    });
    this.props.onChangeParticipantIds(newParticipantIds);
    this.setState({
      validateResult: this.getValidateResult(newParticipantIds, selectedPayerId)
    });
  }

  private onCancelSearchParticipant = (): void => {
    this.setState({
      nameParticipantInput: "",
      participantsInput: this.props.people
    });
  };

  private handleChangeNameParticipantInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let participantsInput: Person[] = [];
    let nameParticipant = event.target.value;
    this.props.people.map(person => {
      if (person.name.toLowerCase().indexOf(nameParticipant.trim().toLowerCase()) > -1) {
        participantsInput.push(person);
      }
    });
    this.setState({
      nameParticipantInput: nameParticipant,
      participantsInput: participantsInput
    });
  }

  render() {
    const { people } = this.props;
    const { selectAllParticipant, validateResult, participantsInput, nameParticipantInput } = this.state;
    return (
      <>
        <Radio
          label={appConstant.intro.EXPENSE_PARTICIPANT}
          inline
          value={this.state.selectAllParticipant}
          onValueChanged={value => this.handleSelectPersonChanged(value, people)}
          name="pork"
          disabled={people.length === 1}
          errorMessage={validateResult}
        >
          <Radio.Item label="All" value="all" />
          <Radio.Item label="Choose particular participant" value="another" />
        </Radio>
        {
          selectAllParticipant === "another" &&
          <List border className="listParticipant">
            <List.Item text={
              <>
                <span>
                  <span onClick={this.handleSelectAllParticipantIds} className="select-all">Select all</span>
                  <span className="slash">/</span>
                  <span onClick={this.handleUnSelectAllParticipantIds} className="unselect-all">Unselect all</span>
                </span>
              </>
            } />
            <List.Divider />
            <List.Item text={
              <TextLineStateless
                value={nameParticipantInput}
                onChange={this.handleChangeNameParticipantInput}
                placeholder="Search for a participant"
                rightButton={
                  <Button
                    iconButton destructive icon={<Icon>close</Icon>}
                    onClick={this.onCancelSearchParticipant}
                  />
                }
              />
            } />
            <List.Divider />
            <div className="listItemParticipant">
              {
                participantsInput.length !== 0
                  ? this.getListPerson(participantsInput)
                  : <List.Item text={
                      <>No results</>
                  } />
              }
            </div>
          </List>
        }
      </>
    );
  }
}