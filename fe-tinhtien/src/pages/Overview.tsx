import * as React from "react";
import {
  ApplicationFrame,
  MenuItem,
  ApplicationHeader,
  FlyoutMenu
} from "@com.mgmtp.a12/widgets";
import { RouteComponentProps } from "react-router-dom";
import { PeopleScreen } from "../components/people/PeopleScreen";
import ExpenseScreen from "../components/expense/ExpenseScreen";
import BalanceScreen from "../components/BalanceScreen";
import OutstandingPayMentScreen from "../components/outstandingpayment/OutStandingPaymentScreen";

const menuItems = [
  { label: "People" },
  { label: "Expenses" },
  { label: "Balance" },
  { label: "Outstanding" }
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
      activityUrl: this.props.match.params.code,
    }
  }

  async componentDidMount(): Promise<void> {
    const activityUrl = this.props.match.params.code;
    await this.getActivityName(activityUrl);
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

  private renderSwitch(activityName: string, activityUrl: string, activeMenu: string) {
    switch (activeMenu) {
      case "People":
        return <PeopleScreen activityUrl={activityUrl} />
      case "Balance":
        return <BalanceScreen />
      case "Outstanding":
        return <OutstandingPayMentScreen activityUrl={activityUrl} />
      default:
        return <ExpenseScreen title="Expenses" activityUrl={activityUrl} />
    }
  }

  render(): React.ReactNode {
    const { activityName, activeMenu, activityUrl } = this.state;

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
            this.renderSwitch(activityName, activityUrl, activeMenu)
          }
        />
      </div>
    );
  }
}
