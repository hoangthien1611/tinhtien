import * as React from "react";
import { Label, List } from "@com.mgmtp.a12/widgets";
import Person from "../models/Person";
import Money from "./money";

export interface BalanceState {
	totalExpense: number;
	averageExpense: number;
	persons: Person[];
}

export function formatToCurrency(num?: number) {
		return num!== undefined 
			? num.toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
			: "0.00";
}

export default class BalanceScreen extends React.Component<{}, BalanceState> {
	constructor(props: {}) {
		super(props);
		this.state = {
			totalExpense: 0,
			averageExpense: 0,
			persons: [],
		};
	}

	async componentDidMount(): Promise<void> {
		let link = window.location.href;
		this.getBalanceInfo(link.substring(link.lastIndexOf("/")))
	}

	async getBalanceInfo(hashCode: string): Promise<void> {
	  try {
			const url: string = "api/activity" + hashCode + "/persons";
			const result = await fetch(url);
			const personJSON = await result.json();
			console.log(personJSON);
      if (personJSON.persons.length == 0) return;
      const totalExpense: number = await personJSON["totalExpense"];
      const persons: Person[] = await personJSON["persons"];
			this.setState({
				totalExpense: totalExpense,
        persons: persons,
        averageExpense: totalExpense / persons.length
			});
		} catch (error) {
			console.log(error);
		}
	}

	render(): React.ReactElement<{}> {
		return (
			<div>
				<div style={{ display: "inline-block", textAlign: "left", float: "left", marginLeft: 15 }}>
					<Label
						style={{ fontSize: 14 }}
						label={"Total Expense"}
					/>
					<Label
						style={{ fontSize: 16, color: "#079ae9" }}
						label={formatToCurrency(this.state.totalExpense)}
					/>
				</div>
				<div style={{ display: "inline-block", textAlign: "right", float: "right", marginRight: 15 }}>
					<Label
						style={{ fontSize: 14 }}
						label={"Average Expense"}
					/>
					<Label
						style={{ fontSize: 16, color: "#079ae9" }}
						label={formatToCurrency(this.state.averageExpense)}
					/>
				</div>
				<br style={{ clear: "both" }} />
				<div>
					<List divider border style={{ marginTop: 10 }}>
						{this.state.persons.map(person => {
							return (
								<List.Item
									key={person.id}
									text={person.name}
									secondaryText={
										<div style={{ color: "#596673" }}>
											{"Paid total " + formatToCurrency(person.totalExpense)}
										</div>
									}
									meta={
										<Money amount={
											person.totalExpense !== undefined 
												? person.totalExpense - this.state.averageExpense
												: 0.00
										} />
									}
								/>
							);
						})}
					</List>
				</div>
			</div>
		);
	}
}
