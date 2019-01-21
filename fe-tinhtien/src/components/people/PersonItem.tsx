import React from 'react';
import { List, Icon, Button } from "@com.mgmtp.a12/widgets";
import Person from '../../models/Person';
import { DeleteDialog } from '../dialog/DeleteDialog';
const personIcon = <Icon>person</Icon>;
const deleteIcon = <Icon>delete</Icon>;
const editIcon = <Icon>edit</Icon>;


interface PersonItemProps {
    person: Person;
    onEdit: (person: Person) => void;
    onDelete: (person: Person) => void;
}

interface PersonItemState {
    isOpenDialog: boolean
}

export class PersonItem extends React.Component<PersonItemProps, PersonItemState> {
    constructor(props: PersonItemProps) {
        super(props);
        this.state = {
            isOpenDialog: false
        }
    }

    render(): React.ReactNode {
        const { person } = this.props;
        return (
            <>
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
                {this.state.isOpenDialog && <DeleteDialog
                    title={"Confirm delete"}
                    message={"Are you sure that you want to delete this person from activity?"}
                    onSubmit={this.confirmDelete}
                    onClose={this.closeModal}
                />
                }
            </>
        );
    }

    closeModal = (): void => {
        this.setState({ isOpenDialog: !this.state.isOpenDialog })
    }

    onDeleteButtonClick = (): void => {
        this.setState({ isOpenDialog: !this.state.isOpenDialog })
    };

    confirmDelete = (): void => {
        const { person, onDelete } = this.props;
        onDelete(person);
        this.closeModal();
    };

    onEditButtonClick = (): void => {
        const { person, onEdit } = this.props;
        onEdit(person);
    };
}
