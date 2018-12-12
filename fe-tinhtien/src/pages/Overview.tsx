import * as React from "react";
import {
  ApplicationFrame,
  MenuItem,
  ApplicationHeader,
  FlyoutMenu
} from "@com.mgmtp.a12/widgets";

const menuItems = [
  { label: "People" },
  { label: "Balance" },
  { label: "Expenses" }
];

interface State {
  menuIndex: number;
}

export default class Overview extends React.Component<{}, State> {
  state: State = {
    menuIndex: 0
  };

  private getMenuItems(): MenuItem[] {
    return menuItems.map((item, index) => ({
      ...item,
      selected: this.state.menuIndex === index,
      onClick: () => this.setState({ menuIndex: index })
    }));
  }

  render(): React.ReactNode {
    const { menuIndex } = this.state;

    return (
      <ApplicationFrame
        main={
          <div>
            <ApplicationHeader leftSlots="TNT" />
            <FlyoutMenu type="horizontal" items={this.getMenuItems()} />
          </div>
        }
        sub={undefined}
        content={menuItems[menuIndex].label}
      />
    );
  }
}
