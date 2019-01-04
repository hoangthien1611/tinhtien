import React from "react";
import CreateActivityForm from "./createActivityform";
import { Button } from "@com.mgmtp.a12/widgets";
import "../../css/main.css";

interface MainPageState {
  showForm: boolean;
}

export default class MainPage extends React.Component<{}, MainPageState> {
  state: MainPageState = {
    showForm: false
  };

  private showForm = () => {
    this.setState({ showForm: true });
  };

  render() {
    return this.state.showForm ? (
      <CreateActivityForm />
    ) : (
        <div className="padding-top-10">
          <Button
            className="center"
            label="Create new activity"
            onClick={this.showForm}
          />
        </div>
      );
  }
}
