package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.ErrorMessage;
import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.repositories.ActivityRepository;
import com.mgmtp.internship.tntbe.repositories.ExpenseRepository;
import com.mgmtp.internship.tntbe.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class PersonService {

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    ExpenseRepository expenseRepository;

    public Object saveNewPerson(PersonDTO personDTO) {
        Activity activity = activityRepository.findByUrl(personDTO.getActivityUrl());
        if (activity != null) {
            return personRepository.save(new Person(personDTO.getName(), true, activity));
        }
        return new ErrorMessage("Activity doesn't exist");
    }

    public Object getPersons(String activityUrl) {
        Activity activity = activityRepository.findByUrl(activityUrl);
        if (activity != null) {
            return activity.getPersons();
        }
        return new ErrorMessage("Activity doesn't exist");
    }

    public Object updatePerson(Person person) {
        if (person != null) {
            Person oldPerson = personRepository.findById(person.getId()).orElse(null);
            if (oldPerson != null) {
                oldPerson.setName(person.getName());
                return personRepository.save(oldPerson);
            } else {
                return new ErrorMessage("Not found Person by id = " + person.getId());
            }
        } else {
            return new ErrorMessage("Null Object Exception");
        }
    }

    public String deletePerson(PersonDTO personDTO) {
        Optional<Person> optionalPerson = personRepository.findById(personDTO.getId());
        boolean personIsExisting = optionalPerson.isPresent();
        if (!personIsExisting) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This person is not existing!");
        } else if (!optionalPerson.get().getActivity().getUrl().equals(personDTO.getActivityUrl())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This person is not existing in this activity!");
        } else if (!expenseRepository.findAllByPerson_Id(personDTO.getId()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not delete this person because he/she has paid for something!");
        } else {
            personRepository.delete(optionalPerson.get());
            return "{ \"message\": \"Delete person successfully!\" }";
        }
    }
}
