import React from "react";
import { ModalNotification, Button } from "@com.mgmtp.a12/widgets";
import { Variant } from "../../utils/Variant";

interface DeleteDialogProps {
	variant?: Variant;
	title: string;
	message: string;
	onClose?: () => void;
	onSubmit?: () => void;
}

export const DeleteDialog: React.FunctionComponent<DeleteDialogProps> = (props: DeleteDialogProps) => (
	<ModalNotification
		variant={props.variant}
		title={props.title}
		footer={
			props.onSubmit
				? (<div>
					<Button
						onClick={props.onSubmit}
						primary
						className="control-button"
					>
						Ok
					</Button>
					<Button
						onClick={props.onClose}
						destructive
						primary
						className="control-button"
					>
						Cancel
					</Button>
				</div>)
				: undefined
		}
	>
		{props.message}
	</ModalNotification>
)