package com.mgmtp.internship.tntbe.entities;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "person")
public class DummyPerson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @ManyToOne(optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

}
