package com.mgmtp.internship.tntbe.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mgmtp.internship.tntbe.entities.Person;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PersonDTO {
    private Long id;

    private String name;

    private String activityUrl;

    private boolean active;

    public PersonDTO(Long id, String name, boolean active) {
        this.id = id;
        this.name = name;
        this.active = active;
    }

    public PersonDTO(Person person) {
        this.id = person.getId();
        this.name = person.getName();
        this.active = person.isActive();
    }
}
