import * as React from "react";
import { Label, List } from "@com.mgmtp.a12/widgets";
import { getBalance } from "../../api/balanceApi";
import Balance from "../../models/Balance";
import { formatToCurrency } from "../../utils/amountFormatter";
import { BalanceItem } from "./BalanceItem";

interface BalanceScreenState {
	balances: Balance[];
}

interface BalanceScreenProps {
	activityUrl: string
}

export default class BalanceScreen extends React.Component<BalanceScreenProps, BalanceScreenState> {
  _isMounted:boolean = false;
	constructor(props: BalanceScreenProps) {
		super(props);
		this.state = {
			balances: [],
		};
	}

	async componentDidMount(): Promise<void> {
    this._isMounted = true;
		getBalance(this.props.activityUrl,
			(balances: Balance[]) => {
				if (this._isMounted) {
          this.setState({ balances })
        }
			},
			message => console.log(message))
  }
  
  componentWillUnmount() {
    this._isMounted = false;
  }

	render(): React.ReactElement<{}> {
		const totalExpense = this.state.balances
			.map(balance => balance.paid)
			.reduce((sum, paid) => sum + paid, 0);
		const averageExpense = this.state.balances.length > 0 ? totalExpense / this.state.balances.length : 0;
		return (
			<div>
				<div style={{ display: "inline-block", textAlign: "left", float: "left", marginLeft: 15, paddingTop: 10 }}>
					<Label
						style={{ fontSize: 14 }}
						label={"Total Expense"}
					/>
					<Label
						style={{ fontSize: 16, color: "#079ae9" }}
						label={formatToCurrency(totalExpense)}
					/>
				</div>
				<div style={{ display: "inline-block", textAlign: "right", float: "right", marginRight: 15, paddingTop: 10 }}>
					<Label
						style={{ fontSize: 14 }}
						label={"Average Expense"}
					/>
					<Label
						style={{ fontSize: 16, color: "#079ae9" }}
						label={formatToCurrency(averageExpense)}
					/>
				</div>
				<br style={{ clear: "both" }} />
				<div>
					<List divider border style={{ marginTop: 10 }}>
						{this.state.balances.map(balance => {
							return (
								<BalanceItem balance={balance} key={balance.person.id} />
							);
						})}
					</List>
				</div>
			</div>
		);
	}
}
