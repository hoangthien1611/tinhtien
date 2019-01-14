import React from "react";
import { ModalNotification, Button } from "@com.mgmtp.a12/widgets";

interface ConfirmDeleteDialogProps {
	onClose: () => void;
	onSubmit: () => void;
}

export const ConfirmDeleteDialog: React.FunctionComponent<ConfirmDeleteDialogProps> = ({ onClose, onSubmit }: ConfirmDeleteDialogProps) => (
	<ModalNotification
		title="Confirm Message!"
		footer={
			<div>
				<Button
					onClick={onSubmit}
					primary
					className="control-button"
				>
					Ok
        </Button>
				<Button
					onClick={onClose}
					destructive
					primary
					className="control-button"
				>
					Cancel
        </Button>
			</div>
		}
	>
		Are you sure that you want to delete this expense?
  </ModalNotification>
)