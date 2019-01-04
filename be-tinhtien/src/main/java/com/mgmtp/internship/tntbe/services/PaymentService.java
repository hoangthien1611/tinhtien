package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.ActivityDTO;
import com.mgmtp.internship.tntbe.dto.Balance;
import com.mgmtp.internship.tntbe.dto.PaymentDTO;
import com.mgmtp.internship.tntbe.utils.ListBalanceUtil;
import com.mgmtp.internship.tntbe.utils.RoundingNumberUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    ActivityService activityService;

    public List<PaymentDTO> getPayments(ActivityDTO activity) {
        List<PaymentDTO> paymentDTOS = new ArrayList<>();
        if (activity.getPersons() != null && activity.getPersons().size() > 0) {
            List<Balance> balances = ListBalanceUtil.getListBalance(activity);
            paymentDTOS = getPayments(balances);
        }
        return paymentDTOS;
    }

    /*
        This method get paymentDTOs from balances:
            1. Sort list balance in increasing order of money
            2. Loop until the size of balances equals to 0
                2.1. Find pairs of balances that have sum of money equals to 0 and add them into paymentDTOs
                2.2. Add new PaymentDTO object with payer is the person of the first balances's element and
                     receiver is the last of balances's element and money is min
                     of the absolute money of the first balances's element and
                     the absolute money of the last balances's element
                     >> (It means after find a new PaymentDTO object has a person who can pay off or
                     can be paid off)
                2.3. Remove the element of balance which has settled and calculate the money of
                     balances's element.
                2.4. Sort list balance in increasing order of money
     */
    private List<PaymentDTO> getPayments(List<Balance> balances) {
        balances.sort(Comparator.comparing(Balance::getMoney));
        List<PaymentDTO> paymentDTOS = new ArrayList<>();
        while (true) {
            // Find pairs of balances
            paymentDTOS.addAll(getPaymentsWithPairPayment(balances));

            if (balances.size() < 2) break;

            // Find min of the absolute money of the first balances's element and
            // the absolute money of the last balances's element
            double minMoney = balances.get(0).getMoney();
            double maxMoney = balances.get(balances.size() - 1).getMoney();
            double paymentValue = Math.min(Math.abs(minMoney), Math.abs(maxMoney));

            // Add new PaymentDTO
            paymentDTOS.add(new PaymentDTO(balances.get(0).getPersonDTO(),
                    balances.get(balances.size() - 1).getPersonDTO(),
                    RoundingNumberUtil.roundOffToDecPlaces(paymentValue, 2)));

            // Remove elements from balances and insert new balance
            balances = ListBalanceUtil.reduceAndInsert(balances);
        }
        return paymentDTOS;
    }


    // Get paymentDTOs from balances by searching pairs of balances that have sum of money equals 0
    private List<PaymentDTO> getPaymentsWithPairPayment(List<Balance> balances) {
        List<PaymentDTO> paymentDTOS = new ArrayList<>();
        for (int i = 0; i < balances.size() && balances.get(i).getMoney() < 0; i++) {
            // Find the index of the opposite money of balance
            int index = ListBalanceUtil.findOppositeNumberIndex(balances.get(i).getMoney(), balances);
            if (index >= 0) {
                paymentDTOS.add(new PaymentDTO(balances.get(i).getPersonDTO(),
                        balances.get(index).getPersonDTO(),
                        RoundingNumberUtil.roundOffToDecPlaces(balances.get(index).getMoney(), 2)));
                balances.remove(index);
                balances.remove(i);
                i--;
            }
        }
        return paymentDTOS;
    }
}

