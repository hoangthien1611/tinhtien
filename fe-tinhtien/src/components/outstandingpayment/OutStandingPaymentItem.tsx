import React from 'react';
import { OutstandingPayment } from '../../models/OutStandingPayment';
import { List, TextOutput, Icon } from "@com.mgmtp.a12/widgets";
import "../../css/outstandingPayment.css"

interface PaymentItemProps {
	outstandingPayment: OutstandingPayment
}

export const OutstandingPaymentItem: React.FunctionComponent<PaymentItemProps> = ({ outstandingPayment }: PaymentItemProps) => (
	<List.Item
		graphic={<Icon>payment</Icon>}
		text={generateOutstandingText(outstandingPayment)}
	/>
)

function generateOutstandingText(outstandingPayment: OutstandingPayment) {
	return (
		<TextOutput>
			<span className="paidPerson-name">{outstandingPayment.paidPerson.name}</span>{" gives "}
			<span className="amount">{outstandingPayment.money}</span>{" to "}
			<span className="receivePerson-name">{outstandingPayment.receivedPerson.name}</span>{" "}
		</TextOutput>
	)
}