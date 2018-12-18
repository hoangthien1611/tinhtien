import React from "react";
import { Button, TextLineStateless } from "@com.mgmtp.a12/widgets";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { saveActivity } from "../../api/mainPageApi";
import {
  checkValidActivityName,
  ValidActivityResult
} from "./checkValidActivity";
import "@com.mgmtp.a12/plasma-design/dist/plasma.css";
import "../../css/main.css";

interface CreateActivityFormState {
  formValue: string;
  validateResult: string;
}

interface CreateActivityFormProps extends RouteComponentProps<any> {}

class CreateActivityForm extends React.Component<
  CreateActivityFormProps,
  CreateActivityFormState
> {
  state: CreateActivityFormState = {
    formValue: "",
    validateResult: ValidActivityResult.EmptyError
  };

  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = event.target.value;
    let checkValidResult = checkValidActivityName(inputValue.trim());
    this.setState({ formValue: inputValue, validateResult: checkValidResult });
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

  private routeToWelcome(url: String) {
    this.props.history.push("/activity/" + url);
  }

  render() {
    return (
      <div className="padding-top-10">
        <div className="center col5">
          <TextLineStateless
            value={this.state.formValue}
            onChange={this.handleInputChange}
            placeholder="Your activity's name"
            autoFocus
          />
          <Button
            label="Create your activity"
            className="margin-top-5 center"
            disabled={this.state.validateResult != ""}
            onClick={() => this.handleCreateActivity()}
          />
        </div>
        <div className="margin-top-2 text-center warning">
          {this.state.validateResult}
        </div>
      </div>
    );
  }
}

export default withRouter(CreateActivityForm);
