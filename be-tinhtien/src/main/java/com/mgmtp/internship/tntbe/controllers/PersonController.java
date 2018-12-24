package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.services.ActivityService;
import com.mgmtp.internship.tntbe.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/person")
public class PersonController {

    @Autowired
    PersonService personService;

    @PostMapping("")
    public Object saveNewPerson(@RequestBody PersonDTO personDTO) {
        return personService.saveNewPerson(personDTO);
    }


}
