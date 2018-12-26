import * as React from "react";
import "../../css/expense.css";

import {
  List,
  Icon,
  Button,
  TextOutput,
  ProgressIndicator
} from "@com.mgmtp.a12/widgets";

import { addExpense, getExpenses } from "../../api/expenseApi";
import commafy from "../../utils/amountFormatter";
import AddExpenseDialog from "./AddExpenseDialog"
import Expense from "../../models/Expense";
import Person from "../../models/Person";

export interface ExpenseScreenProps {
  title: string;
  activityUrl: string;
}

export interface ExpenseScreenState {
  expenses: Expense[];
  loading: boolean;
  addingExpense: boolean;
}

export default class ExpenseScreen extends React.Component<
  ExpenseScreenProps,
  ExpenseScreenState
  > {
  state: ExpenseScreenState = {
    expenses: [],
    loading: false,
    addingExpense: false
  };

  async componentDidMount(): Promise<void> {
    this.toggleLoading();
    getExpenses(this.props.activityUrl,
      (expenses: Expense[]) => {
        this.setState({ expenses })
      },
      (errorMessage: string) => {
        console.log(errorMessage);
      },
      () => {
        this.toggleLoading();
      })
  }

  onClickAddButton = (): void => {
    this.setState({ addingExpense: true })
  };

  toggleLoading = (): void => {
    this.setState({
      loading: !this.state.loading
    });
  };

  render() {
    const { expenses, loading } = this.state;

    return (
      <>
        <div>
          <List id="list-expense" divider border>
            {this.renderExpenses(expenses)}
          </List>
          <Button
            className="btn-add-expense"
            onClick={this.onClickAddButton}
            iconButton
            primary
            icon={<Icon>add</Icon>}
            title="Add expense"
          />
        </div>
        {this.state.addingExpense &&
          <AddExpenseDialog
            people={[
              { id: 1, name: "tri" },
              { id: 2, name: "vu" },
            ]}
            onAddExpense={this.handleAddExpense}
            onClose={() => { this.setState({ addingExpense: false }) }}
          />
        }
        {loading && <ProgressIndicator />}
      </>
    );
  }

  private renderExpenses = (expenses: any[]): React.ReactNode => {
    let result: any[] = [];

    result = expenses.map((item, index) => {
      return (
        <List.Item
          text={this.generateExpenseText(item.person, item.name, item.amount)}
          key={index}
          graphic={<Icon>reply</Icon>}
          meta={
            <>
              <Button iconButton icon={<Icon>edit</Icon>} title="Edit" />
              <Button
                iconButton
                destructive
                icon={<Icon>delete</Icon>}
                title="Delete"
              />
            </>
          }
        />
      );
    });

    return result;
  };

  private generateExpenseText(person: Person, expenseName: string, amount: number) {
    return (
      <TextOutput>
        <span className="person-name">{person.name}</span> paid{" "}
        <span className="amount-expense">{commafy(amount)} ₫</span> for{" "}
        <span className="expense-name">{expenseName}</span>.
      </TextOutput>
    );
  }

  private handleAddExpense = (selectedPerson: number, description: string, amount: number, date: Date) => {
    this.toggleLoading();
    addExpense(selectedPerson, description, amount, date,
      (expense: Expense) => {
        const expenses = this.state.expenses.concat(expense);
        this.setState({ expenses })
      },
      (errorMessage: string) => {
        console.log(errorMessage)
      },
      () => {
        this.toggleLoading();
      }
    )
  }
}
