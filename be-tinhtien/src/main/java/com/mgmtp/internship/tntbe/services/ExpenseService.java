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
        return expenseRepository.findAllByPayerInOrderByCreatedDateAsc(people);
    }

    public Expense updateExpense(ExpenseDTO expenseDTO) {
        validateExpenseData(expenseDTO);

        Expense expenseNeedChange = expenseRepository
                .findById(expenseDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expense is not found!"));

        Person newPerson = personRepository
                .findById(expenseDTO.getPersonId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Person is not found!"));

        if (expenseNeedChange.getPayer().getActivity().getId() != newPerson.getActivity().getId()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The person is not belongs to this activity!");
        }

        expenseNeedChange.setPayer(newPerson);
        expenseNeedChange.setName(StringUtils.normalizeSpace(expenseDTO.getName()));
        expenseNeedChange.setAmount(expenseDTO.getAmount());
        expenseNeedChange.setCreatedDate(expenseDTO.getCreatedDate());

        return expenseRepository.save(expenseNeedChange);
    }

    private void validateExpenseData(ExpenseDTO expenseDTO) {
        if (expenseDTO == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expense must not be null!");
        }

        if (StringUtils.isBlank(expenseDTO.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expense's name must not be white-space only!");
        }

        if (expenseDTO.getName().length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expense's name must not be greater than 255 characters!");
        }

        if (expenseDTO.getAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The amount must be greater than 0!");
        }

        if (expenseDTO.getCreatedDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The created date must not be null!");
        }
    }

    public String deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId).orElse(null);
        if (expense != null) {
            expenseRepository.delete(expense);
            return "{ \"message\": \"Delete expense successfully!\" }";
        }
        else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There's no expense with this id!");
        }
    }
}
