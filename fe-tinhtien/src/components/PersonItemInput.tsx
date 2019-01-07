import React from 'react';
import { Icon, Button, TextLineStateless } from "@com.mgmtp.a12/widgets";
import Person from '../models/Person';
import appConstant from '../utils/appConstant'
const editIcon = <Icon>edit</Icon>;
const editButton = <Button iconButton icon={editIcon} disabled />;

interface PersonItemInputProps {
    person: Person;
    onCancelEdit: () => void;
    onApplyEditResult: (person: Person, newName: string) => void;
    errorMessage?: string;
    handleChangeEditInput: (value?: string) => void;
}

interface PersonItemInputState {
    enteringName: string;
}

export class PersonItemInput extends React.Component<PersonItemInputProps, PersonItemInputState> {
    constructor(props: PersonItemInputProps) {
        super(props);
        this.state = {
            enteringName: this.props.person.name
        }
    }

    render(): React.ReactNode {
        const { errorMessage } = this.props;
        return (
            <>
                <div className="field__message" hidden={errorMessage ? errorMessage.length > 0 : false}>
                    <div className="field__messageIcon"><i className="plasma-icon">_</i></div>
                    <div className="field__messageText"></div>
                </div>
                <TextLineStateless
                    autoFocus={true}
                    value={this.state.enteringName}
                    onChange={event => this.handleChangeEditInput(event.target.value)}
                    onKeyDown={event => this.handleKeyDown(event.key)}
                    placeholder={appConstant.placeholder.ENTER_NAME}
                    button={editButton}
                    rightButton={
                        <Button
                            iconButton destructive icon={<Icon>close</Icon>}
                            onClick={this.onCancelEdit}
                        />
                    }
                    icon={
                        <Button
                            iconButton icon={<Icon>check</Icon>}
                            onClick={this.onApplyEditResult}
                            disabled={errorMessage ? errorMessage.length > 0 : false}
                        />

                    }
                    errorMessage={errorMessage}
                />
            </>
        );
    }

    onCancelEdit = (): void => {
        const { onCancelEdit } = this.props;
        onCancelEdit();
    };

    onApplyEditResult = (): void => {
        const { person, onApplyEditResult } = this.props;
        onApplyEditResult(person, this.state.enteringName);
    };

    private handleChangeEditInput(value: string): void {
        const { handleChangeEditInput } = this.props;
        handleChangeEditInput(value === undefined ? "" : value);
        this.setState({ enteringName: value });
    }

    handleKeyDown(key: string): void {
        const { person, onApplyEditResult, errorMessage } = this.props;
        const { enteringName } = this.state;
        if (key === "Enter" && !errorMessage) {
            onApplyEditResult(person, enteringName);
        }
    }
}
