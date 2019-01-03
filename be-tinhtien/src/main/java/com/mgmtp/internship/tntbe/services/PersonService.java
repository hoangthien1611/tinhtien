package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.ErrorMessage;
import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.repositories.ActivityRepository;
import com.mgmtp.internship.tntbe.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PersonService {

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ActivityRepository activityRepository;

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
}
