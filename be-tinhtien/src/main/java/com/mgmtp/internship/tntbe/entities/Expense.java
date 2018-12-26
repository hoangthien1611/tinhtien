package com.mgmtp.internship.tntbe.entities;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
@Table(name = "expenses")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public Expense() {
    }

    public Expense(DummyPerson person, String name, double amount, Date createdDate) {
        this.person = person;
        this.name = name;
        this.amount = amount;
        this.createdDate = createdDate;
    }

    @ManyToOne(optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private DummyPerson person;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "amount")
    private double amount;

    @Column(name = "created_date")
    private Date createdDate;
}
