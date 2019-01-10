package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.BalanceDTO;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.services.BalanceService;
import com.mgmtp.internship.tntbe.services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/balance")
public class BalanceController {
    @Autowired
    private BalanceService balanceService;

    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/{activityUrl}")
    public List<BalanceDTO> getBalance(@PathVariable String activityUrl) {
        List<Expense> expenses = expenseService.getAll(activityUrl);
        return balanceService.getBalances(expenses);
    }
}
