import * as React from "react";
import {
  ApplicationFrame,
  MenuItem,
  ApplicationHeader,
  FlyoutMenu
} from "@com.mgmtp.a12/widgets";
import { RouteComponentProps } from "react-router-dom";
import { PeopleScreen } from "../components/PeopleScreen";

const menuItems = [
  { label: "People" },
  { label: "Expenses" },
  { label: "Balance" }
];

interface OverviewState {
  activeMenu: string;
  activityName: string;
  activityUrl: string;
}

interface OverviewProps extends RouteComponentProps<any> { }

export default class Overview extends React.Component<OverviewProps, OverviewState> {
  constructor(props: OverviewProps) {
    super(props);

    this.state = {
      activeMenu: "People",
      activityName: "",
      activityUrl: this.props.match.params.code
    }
  }

  async componentDidMount(): Promise<void> {
    await this.getActivityName(this.props.match.params.code);
    if (this.props.history.action === "POP") {
      this.setState({
        activeMenu: "Expenses"
      });
    }
  }

  async getActivityName(activityUrl: string): Promise<void> {
    try {
      const url: string = "api/activity/" + activityUrl;
      const result = await fetch(url);
      const activity = await result.json();
      this.setState({
        activityName: activity.name
      });
    } catch (error) {
      console.log(error);
    }
  }

  private getMenuItems(): MenuItem[] {
    return menuItems.map((item) => ({
      ...item,
      selected: this.state.activeMenu === item.label,
      onClick: () => this.setState({ activeMenu: item.label })
    }));
  }

  render(): React.ReactNode {
    const { activeMenu, activityName, activityUrl } = this.state;

    return (
      <ApplicationFrame
        main={
          <div>
            <ApplicationHeader leftSlots="TNT" />
            <FlyoutMenu type="horizontal" items={this.getMenuItems()} />
          </div>
        }
        content={
          activeMenu === "People"
            ? <PeopleScreen activityUrl={activityUrl} />
            : activeMenu
        }
      />
    );
  }
}
