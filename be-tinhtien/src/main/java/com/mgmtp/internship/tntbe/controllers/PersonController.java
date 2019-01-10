package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/person")
public class PersonController {

    @Autowired
    PersonService personService;

    @PostMapping("")
    public Object saveNewPerson(@RequestBody PersonDTO personDTO) {
        return personService.saveNewPerson(personDTO);
    }

    @GetMapping("/{activityUrl}")
    public Object getPersons(@PathVariable String activityUrl) {
        return personService.getPersons(activityUrl);
    }

    @PutMapping("")
    public Object updatePerson(@RequestBody Person person) {
        return personService.updatePerson(person);
    }

    @DeleteMapping("")
    public String deletePerson(@RequestBody PersonDTO personDTO) {
        return personService.deletePerson(personDTO);
    }
}
