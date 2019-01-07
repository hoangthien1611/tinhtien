import * as React from "react";
import { Label, List } from "@com.mgmtp.a12/widgets";
import { OutstandingPayment } from "../../models/OutStandingPayment";
import { OutstandingPaymentItem } from "./OutStandingPaymentItem";

interface PaymentScreenProps {
    outstandingPayments: OutstandingPayment[]
}

export const OutstandingPayMentScreen: React.FunctionComponent<PaymentScreenProps> = ({ outstandingPayments }: PaymentScreenProps) => (
    <List divider border>
        <List.SubHeader fill>Total: {outstandingPayments.length} transactions</List.SubHeader>
        {
            outstandingPayments.map(op => {
                return <OutstandingPaymentItem
                    outstandingPayment={op}
                />
            })
        }
    </List>
)



