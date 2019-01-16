import * as React from "react";

import {
  List,
  Icon,
  Button,
  TextOutput,
} from "@com.mgmtp.a12/widgets";
import Expense from "../../models/Expense";
import commafy from "../../utils/amountFormatter";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export const ExpenseItem: React.SFC<ExpenseItemProps> = (props: ExpenseItemProps) => {
  return (
    <List.Item
      text={generateExpenseText(props.expense)}
      graphic={<Icon>reply</Icon>}
      meta={
        <>
          <Button
            iconButton secondary
            icon={<Icon>edit</Icon>}
            title="Edit"
            style={{ margin: '0 10px' }}
            onClick={() => props.onEdit(props.expense)} />
          <Button
            iconButton secondary
            destructive
            icon={<Icon>delete</Icon>}
            title="Delete"
            style={{ margin: '0 10px' }}
            onClick={() => props.onDelete(props.expense)}
          />
        </>
      }
    />
  );
}

function generateExpenseText(expense: Expense) {
  return (
    <TextOutput>
      <span className="person-name">{expense.payer.name}</span> paid{" "}
      <span className="amount-expense">{commafy(Number(expense.amount))}</span> for{" "}
      <span className="expense-name">{expense.name}</span>.
    </TextOutput>
  );
}
