import * as React from "react";

import {
  Button,
  Icon,
  ModalOverlay,
  DatePickerDialog,
  TextLineStateless,
} from "@com.mgmtp.a12/widgets";

interface DateInputState {
  selectedDate: Date,
  newDate?: Date,
  showPicker: boolean,
}

interface DateInputProps {
  onChange: (newDate: Date) => void,
  selectedDate: Date
}

export default class DateInput extends React.Component<DateInputProps, DateInputState> {
  constructor(props: DateInputProps) {
    super(props);
    this.state = {
      selectedDate: this.props.selectedDate,
      newDate: undefined,
      showPicker: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  private handleChange(value: Date): void {
    this.setState({ newDate: value });
  }

  private handleOpen(): void {
    this.setState({
      newDate: this.state.selectedDate,
      showPicker: true
    });
  }

  private handleClose(): void {
    this.setState({
      newDate: undefined,
      showPicker: false
    });
  }

  private handleSubmit(): void {
    const { selectedDate, newDate } = this.state
    if (selectedDate !== newDate && newDate) {
      this.props.onChange(newDate)
      this.setState({ selectedDate: newDate });
    }
    this.handleClose();
  }

  render() {
    return (
      <>
        <TextLineStateless
          value={this.state.selectedDate.toDateString()}
          disabled
          button={
            <Button iconButton icon={<Icon>event</Icon>} onClick={this.handleOpen} />
          }
        />
        {this.state.showPicker &&
          <ModalOverlay key="modalOverlay" closeOnOutsideClick onClose={this.handleClose}>
            <DatePickerDialog
              title="Set Date"
              submitButton={<Button primary label="ok" onClick={this.handleSubmit} />}
              value={this.state.newDate}
              onChange={this.handleChange}
              onClose={this.handleClose}
            />
          </ModalOverlay>}
      </>
    );
  }
}
