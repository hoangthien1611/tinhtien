package com.mgmtp.internship.tntbe.controllers;

import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.services.PersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/person")
public class PersonController {

    @Autowired
    PersonService personService;

    @PostMapping("")
    public Person saveNewPerson(@RequestBody PersonDTO personDTO) {
        return personService.saveNewPerson(personDTO);
    }

    @GetMapping("/{activityUrl}")
    public List<Person> getPersons(@PathVariable String activityUrl) {
        return personService.getPersons(activityUrl);
    }

    @PutMapping("")
    public Person updatePerson(@RequestBody Person person) {
        return personService.updatePerson(person);
    }

    @DeleteMapping("")
    public String deletePerson(@RequestBody PersonDTO personDTO) {
        return personService.deletePerson(personDTO);
    }
}
