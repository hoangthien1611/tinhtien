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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private ActivityRepository activityRepository;

    public Expense saveNewExpense(ExpenseDTO expenseDTO) {
        validateExpenseData(expenseDTO);

        if (expenseDTO.getActivityUrl() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ActivityUrl must not be null!");
        }

        Person payer = personRepository
                .findById(expenseDTO.getPayerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payer is not found!"));

        checkPersonJoinedActivity(payer, expenseDTO.getActivityUrl());

        if (expenseDTO.getParticipantIds().length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The expense must have at least one participant!");
        }

        Set<Person> participants = new HashSet<>();
        for (long id : expenseDTO.getParticipantIds()) {
            Person participant = personRepository
                    .findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "A participant is not found!"));

            checkPersonJoinedActivity(participant, expenseDTO.getActivityUrl());
            participants.add(participant);
        }

        // remove extra white space in Item name
        expenseDTO.setName(StringUtils.normalizeSpace(expenseDTO.getName()));

        return expenseRepository.save(
                new Expense(payer, expenseDTO.getName(), expenseDTO.getAmount(), expenseDTO.getCreatedDate(), participants));
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

        Person newPayer = personRepository
                .findById(expenseDTO.getPayerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payer is not found!"));

        checkPersonJoinedActivity(newPayer, expenseNeedChange.getPayer().getActivity().getUrl());

        if (expenseDTO.getParticipantIds().length == 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The expense must have at least one participant!");
        }

        Set<Person> participants = new HashSet<>();
        for (long id : expenseDTO.getParticipantIds()) {
            Person participant = personRepository
                    .findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "A participant is not found!"));

            checkPersonJoinedActivity(participant, expenseNeedChange.getPayer().getActivity().getUrl());
            participants.add(participant);
        }

        expenseNeedChange.setPayer(newPayer);
        expenseNeedChange.setName(StringUtils.normalizeSpace(expenseDTO.getName()));
        expenseNeedChange.setAmount(expenseDTO.getAmount());
        expenseNeedChange.setCreatedDate(expenseDTO.getCreatedDate());
        expenseNeedChange.setParticipants(participants);

        return expenseRepository.save(expenseNeedChange);
    }

    public String deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId).orElse(null);
        if (expense != null) {
            expenseRepository.delete(expense);
            return "{ \"message\": \"Delete expense successfully!\" }";
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There's no expense with this id!");
        }
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

    private void checkPersonJoinedActivity(Person person, String activityUrl) {
        if (!StringUtils.equals(person.getActivity().getUrl(), activityUrl)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "There's a person who is not belongs to this activity!");
        }
    }
}
