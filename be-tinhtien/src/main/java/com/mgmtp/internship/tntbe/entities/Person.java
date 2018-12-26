package com.mgmtp.internship.tntbe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "person")
public class Person {

    @Column(name = "id")
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "active")
    private boolean active;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonIgnore
    private Activity activity;

    public Person(String name, boolean active, Activity activity) {
        this.name = name;
        this.active = active;
        this.activity = activity;
    }

    public Person() {
    }
}
