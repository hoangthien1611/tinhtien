import React from 'react';
import { List, Icon, Button, Dialog, ModalOverlay, ActionContentbox, ContentBoxElements, ModalNotification } from "@com.mgmtp.a12/widgets";
import Person from '../../models/Person';
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
        const { person, onDelete } = this.props;
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
                {this.state.isOpenDialog && <ModalNotification
                    onClose={this.closeModal}
                    title="Delete"
                    footer={
                        <div style={{ textAlign: "right" }}>
                            <Button primary destructive onClick={this.closeModal} label="Cancel" style={{ margin: '0 10px' }} />
                            <Button primary onClick={this.confirmDelete} label="OK" />
                        </div>
                    }
                >
                    Do you want to delete <strong> {person.name} </strong> from activity ?
                </ModalNotification>
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
