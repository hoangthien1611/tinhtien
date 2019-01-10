package com.mgmtp.internship.tntbe.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO {

    private String name;

    private String url;

    private List<PersonDTO> persons;

    public ActivityDTO(String name, String url) {
        this.name = name;
        this.url = url;
    }
}
