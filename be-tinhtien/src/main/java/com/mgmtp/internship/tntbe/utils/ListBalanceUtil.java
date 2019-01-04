package com.mgmtp.internship.tntbe.utils;

import com.mgmtp.internship.tntbe.dto.ActivityDTO;
import com.mgmtp.internship.tntbe.dto.Balance;
import com.mgmtp.internship.tntbe.dto.PersonDTO;

import java.util.ArrayList;
import java.util.List;

public class ListBalanceUtil {
    // Find the index of the opposite money of balance
    public static int findOppositeNumberIndex(double balance, List<Balance> balances) {
        for (int i = 0; i < balances.size(); i++) {
            if (Math.abs(balances.get(i).getMoney() + balance) < 0.01) {
                return i;
            }
        }
        return -1;
    }

    /*
        This function will get the first and the last balances's element and calculate the different.
        The different will then replace the above pair of balances and be inserted into the list while keeping the sort order.
    */
    public static List<Balance> reduceAndInsert(List<Balance> balances) {
        Balance firstBalance = balances.remove(0);
        Balance lastBalance = balances.remove(balances.size() - 1);

        Balance balanceToKeep;
        if (Math.abs(firstBalance.getMoney()) > Math.abs(lastBalance.getMoney())) {
            balanceToKeep = firstBalance;
        } else {
            balanceToKeep = lastBalance;
        }

        Balance insertBalance =
                new Balance(balanceToKeep.getPersonDTO(), firstBalance.getMoney() + lastBalance.getMoney());
        int insertPosition;
        for (insertPosition = 0; insertPosition < balances.size(); insertPosition++) {
            if (balances.get(insertPosition).getMoney() >= insertBalance.getMoney()) {
                break;
            }
        }
        balances.add(insertPosition, insertBalance);
        return balances;
    }

    public static List<Balance> getListBalance(ActivityDTO activity) {
        List<Balance> balances = new ArrayList<>();
        double avgMoney = activity.getTotalExpense() / activity.getPersons().size();
        for (PersonDTO person : activity.getPersons()) {
            if (Math.abs(person.getTotalExpense() - avgMoney) >= 0.01) {
                Balance balance = new Balance(person, person.getTotalExpense() - avgMoney);
                balances.add(balance);
            }
        }
        return balances;
    }
}
