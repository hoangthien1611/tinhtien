import * as React from "react";
import "../../css/expense.css";

import {
  List,
  Icon,
  Button,
  ProgressIndicator,
  ConnectedToast
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
import { setStorage, getStorage } from "../../utils/localStorage";
import appConstant from "../../utils/appConstant";

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
  errorMessage?: string;
  userGuideMessage?: string;
  currentToast?: HTMLElement | null;
}

export default class ExpenseScreen extends React.Component<ExpenseScreenProps, ExpenseScreenState> {
  _isMounted: boolean = false;
  private addExpensesButtonRef: HTMLElement | null = null;
  private listExpensesRef: HTMLElement | null = null;
  state: ExpenseScreenState = {
    expenses: [],
    persons: [],
    loading: false,
    addingExpense: false,
    editingExpense: false,
    deletingExpense: false,
    addable: false,
    errorMessage: undefined,
    userGuideMessage: undefined,
    currentToast: undefined
  };

  private showErrorDialog(errorMessage: string, withRefresh: boolean) {
    if (withRefresh) this.loadData();
    this.setState({ errorMessage: errorMessage });
    setTimeout(() => this.setState({ errorMessage: undefined }), 2000);
  }

  async loadData(): Promise<void> {
    this.toggleLoading();
    getExpenses(
      this.props.activityUrl,
      (expenses: Expense[]) => {
        if (this._isMounted) {
          this.setState({ expenses });
        }
      },
      (errorMessage: string = "There is something wrong with the server right now.") => {
        this.showErrorDialog(errorMessage, false)
      },
      () => {
        this.toggleLoading();
      }
    );
    if (!getStorage("userGuide_ExpensesTab")) {
      this.setState({
        userGuideMessage: appConstant.userGuide.expenses.ADD_EXPENSE_TO_THIS_ACTIVITY,
        currentToast: this.addExpensesButtonRef
      });
    }

    getPersons(this.props.activityUrl, (persons: Person[]) => {
      if (this._isMounted) {
        this.setState({ persons, addable: persons.length > 1 });
      }
    },
      (errorMessage: string = "There is something wrong with the server right now.") => {
        this.showErrorDialog(errorMessage, false);
      })
    this.setState({ errorMessage: undefined });
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadData();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { expenses, loading, addable, persons, addingExpense, editingExpense, deletingExpense, focusExpense, errorMessage, userGuideMessage, currentToast } = this.state;
    const { activityUrl } = this.props;
    return (
      <>
        <div ref={element => this.listExpensesRef = element}>
          <List id="list-expense" divider border
            style={expenses.length === 0 ? { visibility: "hidden" } : { visibility: "visible" }}>
            {this.renderExpenses(expenses)}
          </List>
          <div style={{ minHeight: '60px' }} />
          <Button
            disabled={!addable}
            className="btn-add-expense"
            onClick={this.onClickAddButton}
            iconButton
            primary
            icon={<Icon>add</Icon>}
            title="Add expense"
            buttonRef={element => this.addExpensesButtonRef = element}
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
            addingExpense={true}
            addExpensesButtonRef={this.addExpensesButtonRef}
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

        {errorMessage && (
          <DeleteDialog
            variant={errorMessage.indexOf("successfully") > 0 ? Variant.succes : Variant.error}
            title={"Notification"}
            message={errorMessage}
          />
        )}
        {loading && <ProgressIndicator />}

        {userGuideMessage && addable && currentToast &&
          <ConnectedToast
            referenceElement={currentToast}
            message={userGuideMessage}
            onClose={this.handleToastClose}
            variant={Variant.info}
            duration={5000}
            orientation={currentToast === this.addExpensesButtonRef ? "top" : "bottom"}
          />
        }
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

  private handleToastClose = () => {
    this.setState({
      userGuideMessage: undefined
    });
    if (!getStorage("userGuide_ExpensesTab")) {
      setStorage("userGuide_ExpensesTab", "True");
    }
  }

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
    if (this._isMounted) {
      this.setState({
        loading: !this.state.loading
      });
    }
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
        if (this._isMounted) {
          this.setState({ expenses: newExpenses });
        }
      },
      (errorMessage: string) => {
        this.showErrorDialog(errorMessage, true);
      },
      () => {
        this.toggleLoading();
        if (getStorage("userGuide_ExpensesTab") === "True") {
          this.setState({
            userGuideMessage: appConstant.userGuide.expenses.ADD_MORE_OR_GO_TO_THE_EXPENSES_TAB,
            currentToast: this.listExpensesRef
          })
          setStorage("userGuide_ExpensesTab", "Done");
        } else if (getStorage("userGuide_ExpensesTab") === "Done") {
          this.setState({
            currentToast: undefined
          })
        }
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
        this.showErrorDialog(errorMessage, true);
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

  onDeleteSuccessfully = (errorMessage: string) => {
    this.setState({
      errorMessage,
      deletingExpense: false,
      expenses: this.state.expenses.filter(expense => expense.id !== this.state.focusExpense!.id)
    });
    setTimeout(() => {
      this.setState({ errorMessage: undefined });
    }, 1000);
  }

  onDeleteFailure = (errorMessage: string) => {
    this.setState({
      errorMessage,
      deletingExpense: false,
    });
    this.showErrorDialog(errorMessage, true);
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
