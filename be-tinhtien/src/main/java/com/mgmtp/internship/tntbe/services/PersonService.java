package com.mgmtp.internship.tntbe.services;

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

import java.util.List;
import java.util.Optional;

@Service
public class PersonService {

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ActivityRepository activityRepository;

    @Autowired
    ExpenseRepository expenseRepository;

    public Person saveNewPerson(PersonDTO personDTO) {
        if (personDTO.getName() != null && personDTO.getActivityUrl() != null) {
            if (personDTO.getName().trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Person Name is empty");
            } else if (personDTO.getActivityUrl().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Activity Url is empty");
            } else {
                Activity activity = activityRepository.findByUrl(personDTO.getActivityUrl());
                if (activity != null) {
                    Person person = personRepository.findByNameIgnoreCaseAndActivity(personDTO.getName(), activity);
                    if (person == null) {
                        return personRepository.save(new Person(personDTO.getName(), true, activity));
                    } else {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Person already existed in this activity");
                    }
                } else {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Activity doesn't exist");
                }
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Null Pointer Exception");
        }
    }

    public List<Person> getPersons(String activityUrl) {
        Activity activity = activityRepository.findByUrl(activityUrl);
        if (activity != null) {
            return activity.getPersons();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Activity doesn't exist");
        }
    }

    public Person updatePerson(Person person) {
        if (person != null) {
            Person oldPerson = personRepository.findById(person.getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Person is not found!"));
            Activity activity = oldPerson.getActivity();
            if (personRepository.findByNameIgnoreCaseAndActivity(person.getName(), activity) == null) {
                oldPerson.setName(person.getName());
                return personRepository.save(oldPerson);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Person existed in this activity");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Null Object Exception");
        }
    }

    public String deletePerson(PersonDTO personDTO) {
        Optional<Person> optionalPerson = personRepository.findById(personDTO.getId());
        boolean personIsExisting = optionalPerson.isPresent();
        if (!personIsExisting) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This person is not existing!");
        } else if (!optionalPerson.get().getActivity().getUrl().equals(personDTO.getActivityUrl())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This person is not existing in this activity!");
        } else if (!expenseRepository.findAllByPayer_Id(personDTO.getId()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not delete this person because he/she has paid for something!");
        } else if (!expenseRepository.findAllByParticipantsContains(optionalPerson.get()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Can not delete this person because he/she joined at least a expense!");
        } else {
            personRepository.delete(optionalPerson.get());
            return "{ \"message\": \"Delete person successfully!\" }";
        }
    }
}
