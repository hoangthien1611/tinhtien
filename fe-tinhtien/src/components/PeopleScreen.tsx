import React from 'react';
import { List, TextLineStateless, Icon, Button } from "@com.mgmtp.a12/widgets";
import { Person } from "../models/person";
import { PersonItem } from "./PersonItem";
import appConstant from '../utils/appConstant';
import * as mockData from '../mockdata/mockData.json';

const addIcon = <Icon>add</Icon>;
const closeIcon = <Icon>close</Icon>;

interface PeopleScreenState {
    persons: Person[];
    enteringName?: string;
    showInput: boolean;
}

interface PeopleScreenProps {
    activityUrl: string
}

export class PeopleScreen extends React.Component<PeopleScreenProps, PeopleScreenState> {
    constructor(props: PeopleScreenProps) {
        super(props);
        this.state = {
            persons: mockData.persons,
            enteringName: undefined,
            showInput: false,
        }
    }

    render(): React.ReactNode {
        const { persons, showInput, enteringName } = this.state;

        return (
            <>
                <List divider border>
                    {
                        persons.map(p => {
                            return <PersonItem
                                person={p}
                                key={p.id}
                                onDelete={this.onDeletePerson}
                                onEdit={this.onEditPerson}
                            />
                        })
                    }
                </List >
                {
                    showInput
                        ? <>
                            <TextLineStateless
                                autoFocus={true}
                                value={enteringName}
                                onChange={event => this.handleChange(event.target.value)}
                                placeholder={appConstant.placeholder.ENTER_NAME}
                                onKeyDown={event => this.handleKeyDown(event.key)}
                                errorMessage={this.validateInput(enteringName)}
                                rightButton={
                                    <Button title='Clear' icon={closeIcon} onClick={this.onClearButtonClick} />
                                }
                            />
                            <Button title='Save' label="Save" primary style={{ float: "right" }} onClick={this.onSaveButtonClick} />
                            <Button title='Cancel' label="Cancel" destructive primary style={{ float: "right" }} onClick={this.onCanceluttonClick} />
                        </>
                        : <Button title='Add Person' style={{ float: "right" }} iconButton primary icon={addIcon} onClick={this.onAddButtonClick} />
                }
            </>

        );
    };

    onEditPerson = async (person: Person): Promise<void> => {
        alert('edit ' + person.name);
    };

    onDeletePerson = async (person: Person): Promise<void> => {
        this.setState({
            persons: this.state.persons.filter(p => p.id !== person.id),
        });
    };

    onAddButtonClick = (): void => {
        this.setState({
            showInput: true
        })
    }

    onClearButtonClick = (): void => {
        this.setState({
            enteringName: ""
        })
    }

    onSaveButtonClick = (): void => {
        this.addPerson();
    }

    onCanceluttonClick = (): void => {
        this.setState({
            showInput: false
        })
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
        if (key === "Escape") {
            this.setState({
                showInput: false
            })
        }
    }

    async addPerson(): Promise<void> {
        try {
            const { enteringName, persons } = this.state;
            const { activityUrl } = this.props;
            const response = await fetch('api/person', {
                method: "POST",
                body: JSON.stringify({ name: enteringName, activityUrl }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const newPerson = (await response.json()) as Person;
            this.setState({
                persons: [...persons, newPerson],
                enteringName: undefined,
                showInput: false
            });
        } catch (error) {
            console.log(error);
        }

    }

    validateInput(enteringName?: any): string {
        const trimmedName = enteringName ? enteringName.toLowerCase().trim() : "";
        if (trimmedName.length === 0) {
            return appConstant.THE_NAME_MUST_NOT_BE_EMPTY_OR_WHITESPACE;
        }
        const matchedPersons = this.state.persons.filter(person => {
            return person.name.toLowerCase() == trimmedName;
        });
        return matchedPersons.length > 0 ?
            appConstant.PERSON_NAME_IS_ALREADY_EXIST :
            ""
    }
}