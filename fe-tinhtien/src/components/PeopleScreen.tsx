import React from 'react';
import { List, TextLineStateless, Icon, Button } from "@com.mgmtp.a12/widgets";
import Person from "../models/Person";
import { PersonItem } from "./PersonItem";
import { PersonItemInput } from "./PersonItemInput";
import appConstant from '../utils/appConstant';
import scrollIntoView from 'scroll-into-view-if-needed'

const closeIcon = <Icon>close</Icon>;

interface PeopleScreenState {
    persons: Person[];
    enteringName?: string;
    editingPersonIndex?: number;
    errorMessageEditInput?: string;
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
            errorMessageEditInput: undefined
        }
    }

    async componentDidMount(): Promise<void> {
        await this.getListPerson(this.props.activityUrl);
    }

    async getListPerson(activityUrl: string): Promise<void> {
        try {
            const url: string = "api/person/" + activityUrl;
            const result = await fetch(url);
            const persons = await result.json() as Person[];
            const personsFiltered = persons.filter(person => person.active)
            this.setState({
                persons: personsFiltered
            });
        } catch (error) {
            console.log(error);
        }
    }

    render(): React.ReactNode {
        let { persons, enteringName, editingPersonIndex, errorMessageEditInput } = this.state;
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
                        <div className="field__message" hidden={enteringName.length !== 0 && this.validateInput(enteringName) !== ""}>
                            <div className="field__messageIcon"><i className="plasma-icon">_</i></div>
                            <div className="field__messageText"></div>
                        </div>
                        <TextLineStateless
                            value={enteringName}
                            onChange={event => this.handleChange(event.target.value)}
                            placeholder={appConstant.placeholder.ENTER_NAME}
                            onKeyDown={event => this.handleKeyDown(event.key)}
                            errorMessage={enteringName.length !== 0 ? this.validateInput(enteringName) : ""}
                            rightButton={
                                <Button title='Clear' style={{ width: "100%" }} icon={closeIcon} onClick={this.onClearButtonClick} />
                            }
                            inputRef={instance => this.inputRef = instance}
                        />
                        <Button title='Save' label="Save" primary style={{ float: "right" }} disabled={this.validateInput(enteringName) !== ""} onClick={this.onSaveButtonClick} />
                    </>
                }
            </>

        );
    };

    onCancelEdit = (): void => {
        this.setState({
            editingPersonIndex: undefined,
            errorMessageEditInput: undefined
        })
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
            await fetch('api/person', {
                method: "PUT",
                body: JSON.stringify({ name: this.trimName((newName).trim()), id: person.id }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.log(error);
        }

    }

    private handleChangeEditInput = (value?: string): void => {
        this.setState({
            errorMessageEditInput: this.validateInput(value)
        })
    }

    onEditPerson = async (person: Person): Promise<void> => {
        const { persons } = this.state;
        persons.forEach((p, index) => {
            if (p.name === person.name)
                this.setState({
                    editingPersonIndex: index,
                    errorMessageEditInput: undefined
                })
        })
    };

    onDeletePerson = async (person: Person): Promise<void> => {
        this.setState({
            persons: this.state.persons.filter(p => p.id !== person.id)
        });
    };

    onClearButtonClick = (): void => {
        this.setState({
            enteringName: ""
        })
    }

    onSaveButtonClick = (): void => {
        this.addPerson();
    }

    handleChange = (value: string): void => {
        this.setState({
            enteringName: value
        })
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
                const response = await fetch('api/person', {
                    method: "POST",
                    body: JSON.stringify({ name: this.trimName((enteringName || "").trim()), activityUrl }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const newPerson = (await response.json()) as Person;
                this.setState({
                    persons: [...persons, newPerson],
                    enteringName: undefined,
                });
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
        let trimmedName = this.trimName(enteringName ? enteringName.toLowerCase() : "");
        if (trimmedName.length === 0) {
            return appConstant.errorMessage.THE_NAME_MUST_NOT_BE_EMPTY_OR_WHITESPACE;
        }
        else if (trimmedName.length > 50)
            return appConstant.errorMessage.PERSON_NAME_LENGTH;
        const matchedPersons = this.state.persons.filter(person => {
            return person.name.toLowerCase() == trimmedName;
        });
        return matchedPersons.length > 0 ?
            appConstant.errorMessage.PERSON_NAME_ALREADY_EXISTS :
            ""
    }
}