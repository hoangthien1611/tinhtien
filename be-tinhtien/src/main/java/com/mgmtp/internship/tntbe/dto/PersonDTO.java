package com.mgmtp.internship.tntbe.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
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

    private double totalExpense;

    public PersonDTO(Long id, String name, boolean active, double totalExpense) {
        this.id = id;
        this.name = name;
        this.active = active;
        this.totalExpense = totalExpense;
    }
}
