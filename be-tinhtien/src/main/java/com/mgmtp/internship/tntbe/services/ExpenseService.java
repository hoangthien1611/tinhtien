package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.ExpenseDTO;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.repositories.ActivityRepository;
import com.mgmtp.internship.tntbe.repositories.ExpenseRepository;
import com.mgmtp.internship.tntbe.repositories.PersonRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private ActivityRepository activityRepository;

    public Expense saveNewExpense(ExpenseDTO expenseDTO) {
        if (expenseDTO.getName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Item name is empty!");
        } else if (expenseDTO.getPersonId() == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Person is empty!");
        } else if (expenseDTO.getName().length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Item name is too long, it must contain less than 255 characters!");
        } else if (expenseDTO.getAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0!");
        } else {
            // remove extra white space in Item name
            expenseDTO.setName(StringUtils.normalizeSpace(expenseDTO.getName()));
            Optional<Person> optionalPerson = personRepository.findById(expenseDTO.getPersonId());
            if (optionalPerson.isPresent()) {
                return expenseRepository.save(
                        new Expense(optionalPerson.get(), expenseDTO.getName(), expenseDTO.getAmount(), expenseDTO.getCreatedDate()));
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There's no person with this id");
        }
    }

    public List<Expense> getAll(String activityCode) {
        Activity activity = activityRepository.findByUrl(activityCode);
        if (activity == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There's no activity with this code!");
        }

        List<Person> people = activity.getPersons();
        return expenseRepository.findAllByPersonInOrderByCreatedDateAsc(people);
    }
}
