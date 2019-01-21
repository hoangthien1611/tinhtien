package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.Balance;
import com.mgmtp.internship.tntbe.dto.BalanceDTO;
import com.mgmtp.internship.tntbe.dto.PaymentDTO;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.services.BalanceService;
import com.mgmtp.internship.tntbe.services.ExpenseService;
import com.mgmtp.internship.tntbe.services.PaymentService;
import com.mgmtp.internship.tntbe.services.PersonService;
import com.mgmtp.internship.tntbe.utils.ListBalanceUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BalanceService balanceService;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private PersonService personService;

    @GetMapping("/{url}")
    public List<PaymentDTO> getList(@PathVariable String url) {
        List<Expense> expenses = expenseService.getAll(url);
        List<Person> persons = (List<Person>) personService.getPersons(url);
        List<BalanceDTO> balanceDTOS = balanceService.getBalances(expenses, persons);
        return paymentService.getPayments(ListBalanceUtil.convertAndFilter(balanceDTOS));
    }
}
