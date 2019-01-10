import * as React from "react"
import { List } from "@com.mgmtp.a12/widgets";
import Money from "./Money";
import Balance from "../../models/Balance";
import { formatToCurrency } from "../../utils/amountFormatter";

interface BalanceItemProp {
  balance: Balance
}

export const BalanceItem: React.SFC<BalanceItemProp> = (balanceItemProp: BalanceItemProp) => {
  const balance = balanceItemProp.balance
  return (
    <List.Item
      text={balance.person.name}
      secondaryText={
        <div style={{ color: "#596673" }}>
          {"Paid total " + formatToCurrency(balance.paid)}
        </div>
      }
      meta={
        <Money amount={balance.payBack} />
      }
    />)
}
