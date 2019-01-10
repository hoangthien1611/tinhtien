package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.BalanceDTO;
import com.mgmtp.internship.tntbe.dto.FinancialStatus;
import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.entities.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BalanceService {

    @Autowired
    private ExpenseService expenseService;

    public List<BalanceDTO> getBalances(List<Expense> expenses) {
        Map<Person, FinancialStatus> mapPersonBalance = getFinancialStatusOfEachPerson(expenses);
        return parse(mapPersonBalance);
    }

    private Map<Person, FinancialStatus> getFinancialStatusOfEachPerson(List<Expense> expenses) {
        HashMap<Person, FinancialStatus> mapPersonFinancialStatus = new HashMap<>();
        for (Expense expense : expenses) {
            Set<Person> participants = expense.getParticipants();

            double eachPersonShouldPay = expense.getAmount() / participants.size();
            for (Person useExpensePerson : participants) {
                guaranteeMapHasKey(mapPersonFinancialStatus, useExpensePerson);
                mapPersonFinancialStatus.get(useExpensePerson).addShouldPay(eachPersonShouldPay);
            }

            Person payer = expense.getPayer();
            guaranteeMapHasKey(mapPersonFinancialStatus, payer);
            mapPersonFinancialStatus.get(payer).addPaid(expense.getAmount());
        }
        return mapPersonFinancialStatus;
    }

    private List<BalanceDTO> parse(Map<Person, FinancialStatus> mapPersonFinancialStatus) {
        List<BalanceDTO> listBalanceDTO = new ArrayList<>();
        Set<Person> personIds = mapPersonFinancialStatus.keySet();
        for (Person person : personIds) {
            FinancialStatus financialStatus = mapPersonFinancialStatus.get(person);
            listBalanceDTO.add(new BalanceDTO(new PersonDTO(person), financialStatus.getPaid(), financialStatus.getShouldPay()));
        }
        return listBalanceDTO;
    }

    private void guaranteeMapHasKey(Map<Person, FinancialStatus> mapPersonBalance, Person key) {
        if (!mapPersonBalance.containsKey(key)) {
            mapPersonBalance.put(key, new FinancialStatus());
        }
    }
}
