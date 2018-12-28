import * as React from "react";
import { formatToCurrency } from "./BalanceScreen";

interface MoneyProps {
	amount: number;
}

export const Money = (props: MoneyProps) => {
	const amount = props.amount;
	return (
		<div>
			{
				amount === 0
					? <div style={{ color: "#2f9d2f" }}>{formatToCurrency(amount)}</div>
					:	amount < 0
							? <div style={{ color: "#c91d1d" }}>{formatToCurrency(amount)}</div>
							: <div style={{ color: "#2f9d2f" }}>+{formatToCurrency(amount)}</div>
			}
		</div>
	);
};

export default Money;
