package com.mgmtp.internship.tntbe.services;

import com.mgmtp.internship.tntbe.dto.ErrorMessage;
import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.repositories.ActivityRepository;
import com.mgmtp.internship.tntbe.repositories.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

    @Autowired
    PersonRepository personRepository;

    @Autowired
    ActivityRepository activityRepository;

    public Object saveNewPerson(PersonDTO personDTO) {
        Activity activity = activityRepository.findByUrl(personDTO.getActivityUrl());
        if (activity != null){
            return personRepository.save(new Person(personDTO.getName(), true, activity));
        }
        return new ErrorMessage("Activity doesn't exist");
    }
}
