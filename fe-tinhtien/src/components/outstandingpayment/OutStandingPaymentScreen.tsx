import * as React from "react";
import { Label, List } from "@com.mgmtp.a12/widgets";
import { OutstandingPayment } from "../../models/OutStandingPayment";
import { OutstandingPaymentItem } from "./OutStandingPaymentItem";

interface OutstandingPayMentScreenProps {
  activityUrl: string;
}

interface OutstandingPayMentScreenState {
  outstandingPayments: OutstandingPayment[]
}

export default class OutstandingPayMentScreen extends React.Component<OutstandingPayMentScreenProps, OutstandingPayMentScreenState> {
  constructor(props: OutstandingPayMentScreenProps) {
    super(props);
    this.state = {
      outstandingPayments: []
    };
  }

  async componentDidMount(): Promise<void> {
    await this.getOutstandingPayments(this.props.activityUrl);
  }

  private async getOutstandingPayments(activityUrl: string): Promise<void> {
    try {
      const url: string = "api/payment/" + this.props.activityUrl;
      const result = await fetch(url);
      const payments = await result.json() as OutstandingPayment[];
      await this.setState({
        outstandingPayments: payments
      });
    } catch (error) {
      console.log(error);
    }
  }

  render(): React.ReactNode {
    const { outstandingPayments } = this.state;
    return (
      <List divider border>
        <List.SubHeader fill>Total: {outstandingPayments.length} transactions</List.SubHeader>
        {
          outstandingPayments.map((op, index) => {
            return <OutstandingPaymentItem
              key={index}
              outstandingPayment={op}
            />
          })
        }
      </List>
    );
  }
}
