package com.mgmtp.internship.tntbe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;


@Data
@Entity
@Table(name = "activity")
public class Activity {

    @Column(name = "id")
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "url")
    private String url;

    @OneToMany(mappedBy = "activity")
    @JsonIgnore
    private List<Person> persons;


    public Activity(String name, String url) {
        this.name = name;
        this.url = url;
    }

    public Activity(){}
}

