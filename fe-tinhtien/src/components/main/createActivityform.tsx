import React from "react";
import { Button, TextLineStateless } from "@com.mgmtp.a12/widgets";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { saveActivity } from "../../api/activityApi";
import {
  checkValidActivityName,
  ValidActivityResult
} from "./checkValidActivity";

interface CreateActivityFormState {
  formValue: string;
  validateResult: string;
  showButtonCreate: boolean
}

interface CreateActivityFormProps extends RouteComponentProps<any> { }

class CreateActivityForm extends React.Component<CreateActivityFormProps, CreateActivityFormState> {
  constructor(props: CreateActivityFormProps) {
    super(props);
    this.state = {
      formValue: "",
      validateResult: "",
      showButtonCreate: false,
    }
  }

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    let checkValidResult = checkValidActivityName(inputValue.trim());
    if (checkValidResult != "") {
      this.setState({ formValue: inputValue, validateResult: checkValidResult, showButtonCreate: false });
    } else {
      this.setState({ formValue: inputValue, validateResult: checkValidResult, showButtonCreate: true });
    }
  };

  private handleCreateActivity = () => {
    saveActivity(this.state.formValue.trim()).then(saveResponse => {
      if (saveResponse.hasError) {
        this.setState({ validateResult: saveResponse.errorMessage });
      } else {
        this.routeToWelcome(saveResponse.activityUrl);
      }
    });
  };

  handleKeyDown(key: string): void {
    if (key === "Enter") {
      this.handleCreateActivity();
    }
  }

  private routeToWelcome(url: String) {
    this.props.history.push("/activity/" + url);
  }

  render() {
    return (
      <div className="padding-top-10">
        <div className="center col-7">
          <TextLineStateless
            value={this.state.formValue}
            onChange={this.handleInputChange}
            onKeyDown={event => this.handleKeyDown(event.key)}
            placeholder="Your activity's name"
            autoFocus
          />
          <Button
            label="Create your activity"
            className="center"
            disabled={!this.state.showButtonCreate}
            onClick={() => this.handleCreateActivity()}
          />
        </div>
        <div className="text-center warning">
          {this.state.validateResult}
        </div>
      </div>
    );
  }
}

export default withRouter(CreateActivityForm);
