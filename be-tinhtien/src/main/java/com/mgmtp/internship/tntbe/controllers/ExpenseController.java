package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.ExpenseDTO;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.services.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expense")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @PostMapping("")
    public Object saveNewExpense(@RequestBody ExpenseDTO expenseDTO){
        return expenseService.saveNewExpense(expenseDTO);
    }

    @GetMapping("/{activityCode}")
    public List<Expense> getAll(@PathVariable String activityCode){
        //activityCode is declared to be used later
        return expenseService.getAllByOrderByCreatedDateAsc();
    }
}
