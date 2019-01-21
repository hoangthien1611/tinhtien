import React from 'react';
import { List, TextLineStateless, Icon, Button, ProgressIndicator, ConnectedToast, Toast } from "@com.mgmtp.a12/widgets";
import Person from "../../models/Person";
import { PersonItem } from "./PersonItem";
import { PersonItemInput } from "./PersonItemInput";
import appConstant from '../../utils/appConstant';
import scrollIntoView from 'scroll-into-view-if-needed';
import { getData, addData, updateData, deleteData } from '../../utils/apiCaller';
import { DeleteDialog } from '../dialog/DeleteDialog';
import { Variant } from '../../utils/Variant';
import { setStorage, getStorage, removeStorage } from "../../utils/localStorage";

const closeIcon = <Icon>close</Icon>;

interface PeopleScreenState {
    persons: Person[];
    enteringName?: string;
    editingPersonIndex?: number;
    errorMessageEditInput?: string;
    loading: boolean;
    commonErrorMessage?: string;
    typedInput: boolean;
    deleteMessage?: string;
    currentToast?: HTMLElement | null;
    userGuideMessage?: string;
}

interface PeopleScreenProps {
    activityUrl: string
}

export class PeopleScreen extends React.Component<PeopleScreenProps, PeopleScreenState> {
    _isMounted: boolean = false;
    private inputRef: HTMLElement | null = null;
    constructor(props: PeopleScreenProps) {
        super(props);
        this.state = {
            persons: [],
            enteringName: undefined,
            editingPersonIndex: undefined,
            errorMessageEditInput: undefined,
            loading: false,
            commonErrorMessage: undefined,
            typedInput: false,
            currentToast: undefined,
            userGuideMessage: undefined,
        }
    }

    private showErrorDialog(errorMessage: string, withRefresh: boolean) {
        if (withRefresh) this.loadData();
        this.setState({ commonErrorMessage: errorMessage });
        setTimeout(() => this.setState({ commonErrorMessage: undefined }), 2000);
    }

    async loadData(): Promise<void> {
        this.toggleLoading();
        await this.getListPerson(this.props.activityUrl);
        this.toggleLoading();
    }

    async componentDidMount(): Promise<void> {
        this._isMounted = true;
        this.toggleLoading();
        await this.getListPerson(this.props.activityUrl);
        this.toggleLoading();
        if (!getStorage("userGuide_PeopleTab")) {
            this.setState({
                userGuideMessage: appConstant.userGuide.people.ENTER_PERSON_NAME,
                currentToast: this.inputRef
            });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async getListPerson(activityUrl: string): Promise<void> {
        try {
            const url: string = "api/person/" + activityUrl;
            const persons = await getData(url) as Person[];
            const personsFiltered = persons.filter(person => person.active)
            if (this._isMounted) {
                this.setState({
                    persons: personsFiltered
                });
            }
        } catch (error) {
            this.showErrorDialog("There is something wrong with the server right now.", false);
        }
    }

    render(): React.ReactNode {
        let { persons, enteringName, editingPersonIndex, errorMessageEditInput, loading, commonErrorMessage, typedInput, currentToast, userGuideMessage } = this.state;
        enteringName = enteringName ? enteringName : "";
        return (
            <>
                {
                    persons.length > 0
                        ? <List divider border>
                            {
                                persons.map((person, index) => {
                                    if (index === editingPersonIndex) {
                                        return <PersonItemInput
                                            person={person}
                                            onCancelEdit={this.onCancelEdit}
                                            onApplyEditResult={this.onApplyEditResult}
                                            handleChangeEditInput={this.handleChangeEditInput}
                                            errorMessage={errorMessageEditInput}
                                            key={person.id} />
                                    }
                                    return <PersonItem
                                        person={person}
                                        key={person.id}
                                        onDelete={this.onDeletePerson}
                                        onEdit={this.onEditPerson} />
                                })
                            }
                        </List >
                        : <div />
                }

                {
                    <>
                        <div className="field__message" hidden={typedInput && this.validateInput(enteringName) !== ""}>
                            <div className="field__messageIcon"><i className="plasma-icon">_</i></div>
                            <div className="field__messageText"></div>
                        </div>

                        <TextLineStateless
                            value={enteringName}
                            onChange={event => this.handleChange(event.target.value)}
                            placeholder={appConstant.placeholder.ENTER_NAME}
                            onKeyDown={event => this.handleKeyDown(event.key)}
                            onFocus={this.handleFocusInput}
                            errorMessage={typedInput ? this.validateInput(enteringName) : ""}
                            rightButton={
                                <Button title='Clear' style={{ width: "100%" }} icon={closeIcon} onClick={this.onClearButtonClick} />
                            }
                            inputRef={element => this.inputRef = element} />

                        <Button title='Save' label="Save" primary style={{ float: "right" }} disabled={this.validateInput(enteringName) !== ""} onClick={this.onSaveButtonClick} />
                    </>
                }

                {loading && <ProgressIndicator />}

                {commonErrorMessage && <DeleteDialog
                    variant={commonErrorMessage.indexOf("successfully") > 0 ? Variant.succes : Variant.error}
                    title={"Notification"}
                    message={commonErrorMessage} />
                }

                {currentToast && userGuideMessage &&
                    <ConnectedToast
                        referenceElement={currentToast}
                        message={userGuideMessage}
                        onClose={this.handleToastClose}
                        variant={Variant.info}
                        duration={5000} />
                }
            </>
        );
    };


    closeModal = (): void => {
        this.setState({ commonErrorMessage: undefined })
    }

    toggleLoading = (): void => {
        if (this._isMounted) {
            this.setState({
                loading: !this.state.loading
            });
        }
    };

    onCancelEdit = (): void => {
        this.setState({
            editingPersonIndex: undefined,
            errorMessageEditInput: undefined
        })
    }

    handleToastClose = (): void => {
        this.setState({
            userGuideMessage: undefined
        });
        if (!getStorage("userGuide_PeopleTab")) {
            setStorage("userGuide_PeopleTab", "True");
        }
    }

    handleFocusInput = (): void => {
        if (this.state.editingPersonIndex !== undefined) {
            this.setState({ editingPersonIndex: undefined })
        }
    }

    onApplyEditResult = async (person: Person, newName: string): Promise<void> => {
        try {
            this.toggleLoading();
            const result = await updateData('api/person', { name: this.trimName((newName).trim()), id: person.id });
            if (result.status) {
                this.setState({
                    typedInput: false
                });
                this.showErrorDialog(result.message, true);
                this.onCancelEdit();
            } else {
                const { persons } = this.state;
                const personsEdited = persons.map(p => {
                    if (p.name === person.name) {
                        p.name = newName
                    }
                    return p;
                })
                this.setState({
                    editingPersonIndex: undefined,
                    errorMessageEditInput: undefined,
                    persons: personsEdited
                })
            }
            this.toggleLoading();
        } catch (error) {
            console.log(error);
        }
    }

    private handleChangeEditInput = (value?: string): void => {
        const { editingPersonIndex, persons } = this.state;
        if (editingPersonIndex !== undefined) {
            if (persons[editingPersonIndex].name.toLowerCase() === this.trimName(value ? value.toLowerCase() : "")) {
                this.setState({
                    errorMessageEditInput: ""
                })
            } else {
                this.setState({
                    errorMessageEditInput: this.validateInput(value ? value.toLowerCase() : "")
                })
            }
        }
    }

    onEditPerson = async (person: Person): Promise<void> => {
        const { persons } = this.state;
        persons.forEach((p, index) => {
            if (p.id === person.id) {
                this.setState({
                    editingPersonIndex: index,
                    errorMessageEditInput: undefined
                })
            }
        })
    };

    onClearButtonClick = (): void => {
        this.setState({ enteringName: "" })
    }

    onDeletePerson = async (person: Person): Promise<void> => {
        try {
            this.toggleLoading();
            const result = await deleteData('api/person', { id: person.id, activityUrl: this.props.activityUrl });
            this.toggleLoading();
            if (result.status) {
                const loadData = !(result.message === "Can not delete this person because he/she has paid for something!"
                    || result.message === "Can not delete this person because he/she joined at least a expense!");
                this.showErrorDialog(result.message, loadData);
            } else {
                this.setState({
                    persons: this.state.persons.filter(p => p.id !== person.id),
                });
                this.showErrorDialog(result.message, false);
                if (person.id == Number(getStorage(this.props.activityUrl))) {
                    removeStorage(this.props.activityUrl);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    onSaveButtonClick = (): void => {
        this.addPerson();
    }

    handleChange = (value: string): void => {
        this.setState({
            enteringName: value,
            typedInput: true,
            userGuideMessage: this.state.userGuideMessage ? undefined : undefined
        });
    }

    handleKeyDown(key: string): void {
        if (key === "Enter") {
            this.addPerson();
        }
    }

    async addPerson(): Promise<void> {
        const { enteringName, persons } = this.state;
        const { activityUrl } = this.props;
        // Add person if have no error
        if (this.validateInput(enteringName) === "") {
            try {
                this.toggleLoading();
                const result = await addData('api/person', { name: this.trimName((enteringName || "").trim()), activityUrl });
                if (result.status) {
                    this.setState({
                        typedInput: false
                    });
                    this.showErrorDialog(result.message, true);
                } else {
                    this.setState({
                        persons: [...persons, result],
                        enteringName: undefined,
                        typedInput: false
                    });
                }
                this.toggleLoading();
                if (this.inputRef) {
                    this.inputRef.focus();
                    scrollIntoView(this.inputRef, { behavior: 'smooth', scrollMode: 'if-needed' })
                }
                if (getStorage("userGuide_PeopleTab") === "True") {
                    this.setState({
                        userGuideMessage: appConstant.userGuide.people.ADD_MORE_OR_GO_TO_THE_EXPENSES_TAB,
                        currentToast: this.inputRef
                    })
                }
                setStorage("userGuide_PeopleTab", "Done");
                if (this.inputRef) {
                    this.inputRef.focus();
                    scrollIntoView(this.inputRef, { behavior: 'smooth', scrollMode: 'if-needed' })
                }
            } catch (error) {
                console.log(error);
            }

        }
    }

    private trimName(name: string): string {
        return name.trim().split(' ')
            .filter(word => { return word.trim().length > 0 })
            .join(' ');
    }

    private validateInput(enteringName?: string): string {
        const { persons } = this.state;
        let trimmedName = this.trimName(enteringName ? enteringName.toLowerCase() : "");
        if (trimmedName.length === 0)
            return appConstant.errorMessage.THE_NAME_MUST_NOT_BE_EMPTY_OR_WHITESPACE;
        if (trimmedName.length > 50)
            return appConstant.errorMessage.PERSON_NAME_LENGTH;
        const matchedPersons = persons.filter(person => {
            return person.name.toLowerCase() == trimmedName;
        });
        return matchedPersons.length > 0 ?
            appConstant.errorMessage.PERSON_NAME_ALREADY_EXISTS :
            ""
    }
}
