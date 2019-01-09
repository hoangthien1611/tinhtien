package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.ExpenseDTO;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @PostMapping("")
    public Expense saveNewExpense(@RequestBody ExpenseDTO expenseDTO) {
        return expenseService.saveNewExpense(expenseDTO);
    }

    @GetMapping("/{activityCode}")
    public List<Expense> getAll(@PathVariable String activityCode) {
        return expenseService.getAll(activityCode);
    }

    @PutMapping
    public Expense updateExpense(@RequestBody ExpenseDTO expenseDTO) {
        return expenseService.updateExpense(expenseDTO);
    }

    @DeleteMapping("/{expenseID}")
    public void deleteExpense(@PathVariable long expenseID){
        expenseService.deleteExpense(expenseID);

    }
}
