import * as React from "react";
import {
  ApplicationFrame,
  MenuItem,
  ApplicationHeader,
  FlyoutMenu,
  Button,
  Icon,
  ModalNotification
} from "@com.mgmtp.a12/widgets";
import { RouteComponentProps, Route } from "react-router-dom";
import { PeopleScreen } from "../components/people/PeopleScreen";
import ExpenseScreen from "../components/expense/ExpenseScreen";
import OutstandingPayMentScreen from "../components/outstandingpayment/OutStandingPaymentScreen";
import minorLogo from "../images/minor_logo.png";
import BalanceScreen from "../components/balance/BalanceScreen";
import data from "../data/information.json";

const menuItems = [
  { label: "people" },
  { label: "expenses" },
  { label: "balance" },
  { label: "outstanding" }
];

interface OverviewState {
  activeMenu: string;
  lastActiveMenu: string;
  activityName: string;
  activityUrl: string;
  showPopup: boolean;
}

interface OverviewProps extends RouteComponentProps<any> { }

export default class Overview extends React.Component<OverviewProps, OverviewState> {
  _isMounted: boolean = false;
  constructor(props: OverviewProps) {
    super(props);

    this.state = {
      activeMenu: this.props.match.params.tab === undefined ? "people" : this.props.match.params.tab,
      lastActiveMenu: "",
      activityName: "",
      activityUrl: this.props.match.params.code,
      showPopup: false
    }
  }

  async componentDidMount(): Promise<void> {
    this._isMounted = true;
    const activityUrl = this.props.match.params.code;
    await this.getActivityName(activityUrl);
    document.title = this.state.activityName + " - tinhtien.org";
  }

  async componentWillMount() {
    if (this.props.match.params.tab === undefined) {
      if (this.props.history.action === "POP") {
        this.props.history.replace("/activity/" + this.props.match.params.code + "/expenses");
        this.setState({
          activeMenu: "expenses",
          lastActiveMenu: "expenses",
        })
      }
      else {
        const activityUrl = this.props.match.params.code;
        await this.getActivityName(activityUrl);
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps() {
    if (this._isMounted) {
      this.setState({
        lastActiveMenu: this.props.match.params.tab,
      })
    }
  }

  async componentDidUpdate() {

    const currentTab = this.props.match.params.tab;
    if ((currentTab != "people" && currentTab != "expenses" && currentTab != "balance" && currentTab != "outstanding" && currentTab != undefined)) {
      this.props.history.replace("/404");
    }
    //lastActiveMenu will be updated first in componentWillReceiveProps before activeMenu
    //so lastActiveMenu === activeMenu means the menu had been changed.
    if (this.state.lastActiveMenu === this.state.activeMenu) {
      console.log(this.state.lastActiveMenu);
      await this.getActivityName(this.props.match.params.code);
      if (this._isMounted) {
        this.setState({
          activeMenu: this.props.match.params.tab,
        })
      }
    }
    if (this.props.match.params.tab === undefined) {
      const activityUrl = this.props.match.params.code;
      if (this.props.history.action === "POP") {
        this.props.history.replace("/activity/" + this.props.match.params.code + "/expenses");
        if (this._isMounted) {
          this.setState({
            activeMenu: "expenses",
            lastActiveMenu: "expenses",
          })
        }
      }
      else if (this.state.activityName === "") {
        await this.getActivityName(activityUrl);
      }
    }
  }

  async getActivityName(activityUrl: string): Promise<void> {
    try {
      const url: string = "api/activity/" + activityUrl;
      const result = await fetch(url);
      const activity = await result.json();
      if (activity.error) {
        this.props.history.replace("/404");
      }
      if (this._isMounted) {
        this.setState({
          activityName: activity.name,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  private getMenuItems(): MenuItem[] {
    return menuItems.map((item) => ({
      ...item,
      selected: this.state.activeMenu === item.label,
      onClick: () => {
        if (item.label != this.props.match.params.tab) {
          this.setState({ activeMenu: item.label });
          const goToLink = "/activity/" + this.props.match.params.code + "/" + item.label;
          this.props.history.push(goToLink);
        }
      }
    }));
  }

  private renderTab(activityUrl: string) {
    const parentLink = this.props.match.url.substring(0, this.props.match.url.lastIndexOf("/"));
    const currentTab = this.props.match.params.tab;
    if (currentTab === undefined) {
      if (this.props.history.action === "POP") {
        return <Route path={parentLink + "/expenses"} render={props => <ExpenseScreen title="expenses" activityUrl={activityUrl} {...props} />} />
      }
      else {
        return <PeopleScreen activityUrl={activityUrl} />
      }
    }
    else {
      return (
        <div>
          <Route path={parentLink + "/people"} render={props => <PeopleScreen activityUrl={activityUrl} {...props} />} />
          <Route path={parentLink + "/expenses"} render={props => <ExpenseScreen title="expenses" activityUrl={activityUrl} {...props} />} />
          <Route path={parentLink + "/balance"} render={props => <BalanceScreen activityUrl={activityUrl} {...props} />} />
          <Route path={parentLink + "/outstanding"} render={props => <OutstandingPayMentScreen activityUrl={activityUrl} {...props} />} />
        </div>
      );
    }
  }

  private shortenActivityName(activityName: string, maximumLength: number) {
    if (activityName.length < maximumLength) {
      return activityName;
    }
    for (let i = maximumLength; i > 1; i--) {
      if (activityName.charAt(i) === " ") {
        return activityName.substring(0, i) + " ...";
      }
    }
    return activityName.substring(0, maximumLength) + " ...";
  }

  render(): React.ReactNode {
    const { activityUrl, activityName, showPopup } = this.state;

    return (
      <div>
        <ApplicationFrame
          main={
            <div>
              <ApplicationHeader
                leftSlots={[
                  <a href="#">
                    <img src={minorLogo} />
                  </a>,
                  <p>TinhTien</p>
                ]}
                rightSlots={[
                  <p>{this.shortenActivityName(activityName, window.innerWidth >= 800 ? 42 : window.innerWidth / 20 + 2)}</p>,
                  <Button iconButton secondary style={{ padding: 0, border: 0 }}
                    onClick={this.showPopup} icon={<Icon>info</Icon>} title="Something helpful" />
                ]}
              />
              <FlyoutMenu type="horizontal" items={this.getMenuItems()} />
            </div>
          }
          sub={undefined}
          content={
            this.renderTab(activityUrl)
          }
        />
        {showPopup && <ModalNotification
          title={"Something helpful for you"}
          footer={
            <Button className="h_floatRight" onClick={this.closePopup}>Close</Button>
          }
        >
          {this.generateInformation()}
        </ModalNotification>}
      </div>
    );
  }

  private showPopup = (): void => {
    this.setState({
      showPopup: true
    });
  }

  private closePopup = (): void => {
    this.setState({
      showPopup: false
    })
  }

  private generateInformation() {
    return (
      <>
        {data.information.overview}
        <br />
        <br />
        {this.generateInformationForOneTab("People", data.information.people)}
        <br />
        {this.generateInformationForOneTab("Expenses", data.information.expenses)}
        <br />
        {this.generateInformationForOneTab("Balance", data.information.balance)}
        <br />
        {this.generateInformationForOneTab("Outstanding", data.information.outstanding)}
        <br />
        <br />
      </>
    );
  }

  private generateInformationForOneTab(tabName: string, tabContent: string[]) {
    return (
      <>
        <b>&nbsp;&nbsp;&nbsp;&diams; {tabName}</b>
        <br />
        {
          tabContent.map(item => {
            return (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9679; {item}
                <br />
              </>
            );
          })
        }
      </>
    );
  }
}
