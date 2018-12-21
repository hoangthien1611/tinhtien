import * as React from "react";
import "@com.mgmtp.a12/plasma-design/dist/plasma.css";
import {
  ApplicationFrame,
  MenuItem,
  ApplicationHeader,
  FlyoutMenu
} from "@com.mgmtp.a12/widgets";
import { RouteComponentProps } from "react-router-dom";

const menuItems = [
  { label: "People" },
  { label: "Expenses" },
  { label: "Balance" }
];

interface State {
  menuIndex: number;
  activityName: string;
}

interface MainOverviewProps extends RouteComponentProps<any> {}

export default class Overview extends React.Component<
  MainOverviewProps,
  State
> {
  state: State = {
    menuIndex: 0,
    activityName: ""
  };

  async componentDidMount(): Promise<void> {
    this.getActivityName(this.props.match.params.code);
    if (this.props.history.action === "POP") {
      this.setState({
        menuIndex: 1
      });
    }
  }

  async getActivityName(hashUrl: string): Promise<void> {
    try {
      const url: string = "api/activity/" + hashUrl;
      const result = await fetch(url);
      const activityNameJson = await result.json();
      this.setState({ activityName: activityNameJson["name"] });
    } catch (error) {
      console.log(error);
    }
  }

  private getMenuItems(): MenuItem[] {
    return menuItems.map((item, index) => ({
      ...item,
      selected: this.state.menuIndex === index,
      onClick: () => this.setState({ menuIndex: index })
    }));
  }

  render(): React.ReactNode {
    const { menuIndex, activityName } = this.state;

    return (
      <div>
        <ApplicationFrame
          main={
            <div>
              <ApplicationHeader leftSlots="TNT" />
              <FlyoutMenu type="horizontal" items={this.getMenuItems()} />
            </div>
          }
          sub={undefined}
          content={
            "Activity: " + activityName + " - " + menuItems[menuIndex].label
          }
        />
      </div>
    );
  }
}
