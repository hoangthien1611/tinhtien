import * as React from "react";
import "../../css/expense.css";

import {
  List,
  Icon,
  Button,
  ProgressIndicator,
  ModalNotification
} from "@com.mgmtp.a12/widgets";

import { addExpense, getExpenses, editExpense, deleteExpense } from "../../api/expenseApi";
import Expense from "../../models/Expense";
import Person from "../../models/Person";
import { getPersons } from "../../api/personApi";
import { compareDateInYearMonthDay } from "../../utils/dateHelper";
import { ExpenseItem } from "./ExpenseItem";
import ExpenseDialog from "./ExpenseDialog";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

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
  showSuccessfulNotification: boolean
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
    showSuccessfulNotification: false
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
    const { expenses, loading, addable, persons, addingExpense, editingExpense, deletingExpense, focusExpense, showSuccessfulNotification } = this.state;
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
            people={persons}
            onSubmit={this.handleAddExpense}
            onClose={() => {
              this.setState({ addingExpense: false });
            }}
          />
        )}
        {editingExpense && focusExpense && (
          <ExpenseDialog
            people={persons}
            onSubmit={this.handleEditExpense}
            onClose={() => {
              this.setState({ editingExpense: false, focusExpense: undefined });
            }}
            expense={focusExpense}
          />
        )}
        {deletingExpense && focusExpense && (
          <ConfirmDeleteDialog
            onSubmit={this.handleDeleteExpense}
            onClose={() => {
              this.setState({ deletingExpense: false, focusExpense: undefined })
            }}
          />
        )}
        {showSuccessfulNotification && (
          <ModalNotification
            variant="success"
            title="Notification"
          >
            Deleted successfully
          </ModalNotification>
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
    name: string,
    amount: number,
    personId: number,
    createdDate: Date,
  ) => {
    this.toggleLoading();
    addExpense(
      name, amount, personId, createdDate,
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

  private handleEditExpense = (name: string, amount: number, personId: number, createdDate: Date, id?: number) => {
    if (!id) return;
    this.toggleLoading();
    editExpense(
      id, name, amount, personId, createdDate,
      (expense: Expense) => {
        const newExpenses = this.editExpenseInLocal(this.state.expenses, expense)
        if (newExpenses) { this.setState({ expenses: newExpenses }); }
        console.log(expense);
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
    deleteExpense(id,
      () => {
        this.setState({ deletingExpense: false, showSuccessfulNotification: true });
        setTimeout(() => { this.setState({ showSuccessfulNotification: false }) }, 1000)
      },
      (errorMessage: String) => {
        this.setState({ deletingExpense: false });
        console.log(errorMessage);
      }
    );
    this.setState({
      expenses: this.state.expenses.filter(p => p.id !== (this.state.focusExpense ? this.state.focusExpense.id : 0)),
      deletingExpense: false,
      showSuccessfulNotification: true

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
