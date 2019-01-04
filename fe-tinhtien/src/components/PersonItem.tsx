import React from 'react';
import { List, Icon, Button } from "@com.mgmtp.a12/widgets";
import { Person } from '../models/person';
const personIcon = <Icon>person</Icon>;
const deleteIcon = <Icon>delete</Icon>;
const editIcon = <Icon>edit</Icon>;

interface PersonItemProps {
    person: Person;
    onEdit: (person: Person) => void;
    onDelete: (person: Person) => void;
}

interface PersonItemState {
}

export class PersonItem extends React.Component<PersonItemProps, PersonItemState> {
    constructor(props: PersonItemProps) {
        super(props);
    }

    render(): React.ReactNode {
        const { person } = this.props;
        return (
            <List.Item
                text={person.name}
                graphic={personIcon}
                meta={
                    <>
                        <Button
                            title="Edit"
                            style={{ margin: '0 10px' }}
                            iconButton secondary icon={editIcon}
                            onClick={this.onEditButtonClick}
                        />
                        <Button
                            title="Delete"
                            style={{ margin: '0 10px' }}
                            iconButton secondary destructive icon={deleteIcon}
                            onClick={this.onDeleteButtonClick}
                        />
                    </>
                }
            />
        );
    }

    onDeleteButtonClick = (): void => {
        const { person, onDelete } = this.props;
        onDelete(person);
    };

    onEditButtonClick = (): void => {
        const { person, onEdit } = this.props;
        onEdit(person);
    };
}
