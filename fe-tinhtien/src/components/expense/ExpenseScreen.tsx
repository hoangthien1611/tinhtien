import * as React from "react";
import "../../css/expense.css";

import {
  List,
  Icon,
  Button,
  ProgressIndicator
} from "@com.mgmtp.a12/widgets";

import { addExpense, getExpenses, editExpense, deleteExpense } from "../../api/expenseApi";
import Expense from "../../models/Expense";
import Person from "../../models/Person";
import { getPersons } from "../../api/personApi";
import { compareDateInYearMonthDay } from "../../utils/dateHelper";
import { ExpenseItem } from "./ExpenseItem";
import ExpenseDialog from "./ExpenseDialog";
import { DeleteDialog } from "../dialog/DeleteDialog";
import { Variant } from "../../utils/Variant";

export interface ExpenseScreenProps {
  title: string;
  activityUrl: string;
}

export interface ExpenseScreenState {
  expenses: Expense[];
  persons: Person[];
  loading: boolean;
  addingExpense: boolean;
  editingExpense: boolean;
  deletingExpense: boolean;
  focusExpense?: Expense;
  addable: boolean;
  deleteMessage?: string
}

export default class ExpenseScreen extends React.Component<ExpenseScreenProps, ExpenseScreenState> {
  state: ExpenseScreenState = {
    expenses: [],
    persons: [],
    loading: false,
    addingExpense: false,
    editingExpense: false,
    deletingExpense: false,
    addable: false,
    deleteMessage: undefined
  };

  async componentDidMount(): Promise<void> {
    this.toggleLoading();
    getExpenses(
      this.props.activityUrl,
      (expenses: Expense[]) => {
        this.setState({ expenses });
      },
      (errorMessage: string) => {
        console.log(errorMessage);
      },
      () => {
        this.toggleLoading();
      }
    );

    getPersons(this.props.activityUrl, (persons: Person[]) => {
      this.setState({ persons, addable: persons.length > 0 });
    },
      (errorMessage: string) => {
        console.log(errorMessage);
      })
  }

  render() {
    const { expenses, loading, addable, persons, addingExpense, editingExpense, deletingExpense, focusExpense, deleteMessage } = this.state;
    const { activityUrl } = this.props;
    return (
      <>
        <div>
          <List id="list-expense" divider border
            style={expenses.length === 0 ? { visibility: "hidden" } : { visibility: "visible" }}>
            {this.renderExpenses(expenses)}
          </List>
          <Button
            disabled={!addable}
            className="btn-add-expense"
            onClick={this.onClickAddButton}
            iconButton
            primary
            icon={<Icon>add</Icon>}
            title="Add expense"
          />
        </div>
        {addingExpense && (
          <ExpenseDialog
            activityUrl={activityUrl}
            people={persons}
            onSubmit={this.handleAddExpense}
            onClose={() => {
              this.setState({ addingExpense: false });
            }}
          />
        )}
        {editingExpense && focusExpense && (
          <ExpenseDialog
            activityUrl={activityUrl}
            people={persons}
            onSubmit={this.handleEditExpense}
            onClose={() => {
              this.setState({ editingExpense: false, focusExpense: undefined });
            }}
            expense={focusExpense}
          />
        )}
        {deletingExpense && focusExpense && (
          <DeleteDialog
            title={"Confirm delete"}
            message={"Are you sure that you want to delete this expense?"}
            onSubmit={this.handleDeleteExpense}
            onClose={this.cancelDelete}
          />
        )}
        {deleteMessage && (
          <DeleteDialog
            variant={deleteMessage.indexOf("successfully") > 0 ? Variant.succes : Variant.error}
            title={"Notification"}
            message={deleteMessage}
          />
        )}
        {loading && <ProgressIndicator />}
      </>
    );
  }

  private renderExpenses = (expenses: any[]): React.ReactNode => {
    return expenses.map(item => {
      return (
        <ExpenseItem expense={item} onDelete={this.onClickDeleteButton} onEdit={this.onClickEditButton} key={item.id} />
      );
    });
  };

  private onClickAddButton = () => {
    this.setState({ addingExpense: true });
  };

  private onClickEditButton = (focusExpense?: Expense) => {
    this.setState({ editingExpense: true, focusExpense });
  }

  private onClickDeleteButton = (focusExpense: Expense) => {
    this.setState({ deletingExpense: true, focusExpense })
  }

  private toggleLoading = (): void => {
    this.setState({
      loading: !this.state.loading
    });
  };

  private handleAddExpense = (
    activityUrl: string,
    name: string,
    amount: number,
    personId: number,
    createdDate: Date,
    participantIds: number[]
  ) => {
    this.toggleLoading();
    addExpense(
      activityUrl, name, amount, personId, createdDate, participantIds,
      (expense: Expense) => {
        const newExpenses = this.addExpenseInLocal(this.state.expenses, expense)
        this.setState({ expenses: newExpenses });
      },
      (errorMessage: string) => {
        console.log(errorMessage);
      },
      () => {
        this.toggleLoading();
      }
    );
  };

  private handleEditExpense = (activityUrl: string, name: string, amount: number, personId: number, createdDate: Date, participantIds: number[], id?: number) => {
    if (!id) return;
    this.toggleLoading();
    editExpense(
      activityUrl, id, name, amount, personId, participantIds, createdDate,
      (expense: Expense) => {
        const newExpenses = this.editExpenseInLocal(this.state.expenses, expense)
        if (newExpenses) { this.setState({ expenses: newExpenses }); }
      },
      (errorMessage: string) => {
        console.log(errorMessage);
      },
      () => {
        this.toggleLoading();
      }
    );
  }

  private handleDeleteExpense = () => {
    const id = this.state.focusExpense ? this.state.focusExpense.id : undefined;
    if (!id) return;
    deleteExpense(
      id,
      this.onDeleteSuccessfully,
      this.onDeleteFailure
    );
  }

  onDeleteSuccessfully = (deleteMessage: string) => {
    this.setState({
      deleteMessage,
      deletingExpense: false,
      expenses: this.state.expenses.filter(expense => expense.id !== this.state.focusExpense!.id)
    });
    setTimeout(() => this.setState({ deleteMessage: undefined }), 1000);
  }

  onDeleteFailure = (deleteMessage: string) => {
    this.setState({
      deleteMessage,
      deletingExpense: false,
    });
    setTimeout(() => this.setState({ deleteMessage: undefined }), 3000);
  }

  cancelDelete = () => {
    this.setState({
      deletingExpense: false,
      focusExpense: undefined
    });
  }

  private addExpenseInLocal(originExpenses: Expense[], addExpense: Expense) {
    const newExpenses = originExpenses.slice()
    let insertPosition = 0;
    for (; insertPosition < newExpenses.length; insertPosition++) {
      if (compareDateInYearMonthDay(newExpenses[insertPosition].date, addExpense.date) > 0) {
        break;
      }
    }
    newExpenses.splice(insertPosition, 0, addExpense);
    return newExpenses;
  }

  private editExpenseInLocal(originExpenses: Expense[], editExpense: Expense) {
    for (let i = 0; i < originExpenses.length; i++) {
      if (originExpenses[i].id === editExpense.id) {
        originExpenses.splice(i, 1)
        return this.addExpenseInLocal(originExpenses, editExpense)
      }
    }
  }
}
