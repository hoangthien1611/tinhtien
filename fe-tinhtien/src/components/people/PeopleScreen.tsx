import React from 'react';
import { List, TextLineStateless, Icon, Button, ProgressIndicator } from "@com.mgmtp.a12/widgets";
import Person from "../../models/Person";
import { PersonItem } from "./PersonItem";
import { PersonItemInput } from "./PersonItemInput";
import appConstant from '../../utils/appConstant';
import scrollIntoView from 'scroll-into-view-if-needed';
import { getData, addData, updateData, deleteData } from '../../utils/apiCaller';
import { DeleteDialog } from '../dialog/DeleteDialog';
import { Variant } from '../../utils/Variant';

const closeIcon = <Icon>close</Icon>;

interface PeopleScreenState {
    persons: Person[];
    enteringName?: string;
    editingPersonIndex?: number;
    errorMessageEditInput?: string;
    loading: boolean;
    deleteMessage?: string;
    typedInput: boolean;
}

interface PeopleScreenProps {
    activityUrl: string
}

export class PeopleScreen extends React.Component<PeopleScreenProps, PeopleScreenState> {
    private inputRef: HTMLInputElement | null = null;
    constructor(props: PeopleScreenProps) {
        super(props);
        this.state = {
            persons: [],
            enteringName: undefined,
            editingPersonIndex: undefined,
            errorMessageEditInput: undefined,
            loading: false,
            deleteMessage: undefined,
            typedInput: false
        }
    }

    async componentDidMount(): Promise<void> {
        this.toggleLoading();
        await this.getListPerson(this.props.activityUrl);
        this.toggleLoading();
    }

    async getListPerson(activityUrl: string): Promise<void> {
        try {
            const url: string = "api/person/" + activityUrl;
            const persons = await getData(url) as Person[];
            const personsFiltered = persons.filter(person => person.active)
            this.setState({
                persons: personsFiltered
            });
        } catch (error) {
            console.log(error);
        }
    }

    render(): React.ReactNode {
        let { persons, enteringName, editingPersonIndex, errorMessageEditInput, loading, deleteMessage, typedInput } = this.state;
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
                                            key={person.id}
                                        />
                                    }
                                    return <PersonItem
                                        person={person}
                                        key={person.id}
                                        onDelete={this.onDeletePerson}
                                        onEdit={this.onEditPerson}
                                    />
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
                            inputRef={instance => this.inputRef = instance}
                        />
                        <Button title='Save' label="Save" primary style={{ float: "right" }} disabled={this.validateInput(enteringName) !== ""} onClick={this.onSaveButtonClick} />
                    </>
                }
                {loading && <ProgressIndicator />}

                {deleteMessage && <DeleteDialog
                    variant={deleteMessage.indexOf("successfully") > 0 ? Variant.succes : Variant.error}
                    title={"Notification"}
                    message={deleteMessage}
                />
                }

            </>

        );
    };

    closeModal = (): void => {
        this.setState({ deleteMessage: undefined })
    }

    toggleLoading = (): void => {
        this.setState({
            loading: !this.state.loading
        });
    };

    onCancelEdit = (): void => {
        this.setState({
            editingPersonIndex: undefined,
            errorMessageEditInput: undefined
        })
    }

    handleFocusInput = (): void => {
        if (this.state.editingPersonIndex !== undefined) {
            this.setState({ editingPersonIndex: undefined })
        }
    }

    onApplyEditResult = async (person: Person, newName: string): Promise<void> => {
        try {
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
            await updateData('api/person', { name: this.trimName((newName).trim()), id: person.id });
        } catch (error) {
            console.log(error);
        }

    }

    private handleChangeEditInput = (value?: string): void => {
        const { editingPersonIndex, persons } = this.state;
        if (editingPersonIndex !== undefined) {
            if (persons[editingPersonIndex].name === this.trimName(value ? value.toLowerCase() : "")) {
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

    onDeletePerson = async (person: Person): Promise<void> => {
        try {
            this.toggleLoading();
            const result = await deleteData('api/person', { id: person.id, activityUrl: this.props.activityUrl });
            this.toggleLoading();
            if (result.status) {
                this.setState({
                    deleteMessage: result.message
                });
                setTimeout(() => this.setState({ deleteMessage: undefined }), 3000);
            } else {
                this.setState({
                    persons: this.state.persons.filter(p => p.id !== person.id),
                    deleteMessage: result.message
                });
                setTimeout(() => this.setState({ deleteMessage: undefined }), 1000);
            }
        } catch (error) {
            console.log(error);
        }
    };

    onClearButtonClick = (): void => {
        this.setState({ enteringName: "" })
    }

    onSaveButtonClick = (): void => {
        this.addPerson();
    }

    handleChange = (value: string): void => {
        this.setState({ enteringName: value, typedInput: true })
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
                const newPerson = await addData('api/person', { name: this.trimName((enteringName || "").trim()), activityUrl }) as Person;
                this.setState({
                    persons: [...persons, newPerson],
                    enteringName: undefined,
                    typedInput: false
                });
                this.toggleLoading();
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
