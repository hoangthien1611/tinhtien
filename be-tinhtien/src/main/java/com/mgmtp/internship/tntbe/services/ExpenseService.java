package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.ErrorMessage;
import com.mgmtp.internship.tntbe.dto.ExpenseDTO;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.repositories.DummyPersonRepository;
import com.mgmtp.internship.tntbe.repositories.ExpenseRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private DummyPersonRepository dummyPersonRepository;

    public Object saveNewExpense(ExpenseDTO expenseDTO){
        if(expenseDTO.getName().trim().isEmpty()) {
            return new ErrorMessage("Item name is empty!");
        }

        else if(expenseDTO.getPersonId() == 0) {
            return new ErrorMessage("DummyPerson is empty!");
        }

        else if(expenseDTO.getName().length() >255) {
            return new ErrorMessage("Item name is too long, it must be no larger than 255 characters!");
        }

        else if(expenseDTO.getAmount() <= 0) {
            return new ErrorMessage("Amount must be larger than 0 vnd!");
        }

        else {
            //remove extra white space in Item name
            expenseDTO.setName(StringUtils.normalizeSpace(expenseDTO.getName()));
            return expenseRepository.save(new Expense(dummyPersonRepository.findAllById(expenseDTO.getPersonId()), expenseDTO.getName(), expenseDTO.getAmount(), expenseDTO.getCreatedDate()));
        }
    }

    public List<Expense> getAllByOrderByCreatedDateAsc(){
        return expenseRepository.getAllByOrderByCreatedDateAsc();
    }
}
