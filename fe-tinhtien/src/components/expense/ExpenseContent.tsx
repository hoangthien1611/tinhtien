import * as React from "react";
import "@com.mgmtp.a12/plasma-design/dist/plasma.css";
import "./expense.css";

import {
  List,
  Icon,
  Button,
  TextOutput,
  ProgressIndicator
} from "@com.mgmtp.a12/widgets";

import callApi from "../../utils/apiCaller";
import commafy from "../../utils/amountFormatter";
import { Expense } from "../../models/Expense";

export interface ExpenseScreenProps {
  title: string;
}
export interface ExpenseScreenState {
  expenses: Expense[];
  loading: boolean;
}

// Run `npm run start-server` to start the fake server
const BASE_URL = "http://localhost:8080/expenses";

export default class ExpenseScreen extends React.Component<
  ExpenseScreenProps,
  ExpenseScreenState
> {
  state: ExpenseScreenState = {
    expenses: [],
    loading: false
  };

  async componentDidMount(): Promise<void> {
    try {
      this.toggleLoading();
      const response = await callApi(BASE_URL);
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const responseJson = await response.json();
      if (responseJson.error) {
        throw Error(responseJson.error);
      }
      this.setState(
        {
          expenses: responseJson
        },
        () => {
          this.toggleLoading();
        }
      );
    } catch (error) {
      this.toggleLoading();
      console.log(error);
    }
  }

  onClickAddButton = (): void => {
    alert("Clicked add expense!");
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
          <List divider border>
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
        {loading && <ProgressIndicator />}
      </>
    );
  }

  renderExpenses = (expenses: any[]): React.ReactNode => {
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

  generateExpenseText(person: string, expenseName: string, amount: number) {
    return (
      <TextOutput>
        <span className="person-name">{person}</span> paid{" "}
        <span className="amount-expense">{commafy(amount)} ₫</span> for{" "}
        <span className="expense-name">{expenseName}</span>.
      </TextOutput>
    );
  }
}
