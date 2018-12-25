package com.mgmtp.internship.tntbe.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mgmtp.internship.tntbe.entities.Person;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_ABSENT)
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO {

    private String name;

    private String url;

    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private double totalExpense;

    private List<PersonDTO> persons;

    public ActivityDTO(String name, String url) {
        this.name = name;
        this.url = url;
    }
}
