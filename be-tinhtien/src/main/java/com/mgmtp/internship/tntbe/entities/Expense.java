package com.mgmtp.internship.tntbe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "expenses")
@NoArgsConstructor
@AllArgsConstructor
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    public Expense(Person payer, String name, double amount, Timestamp createdDate, Set<Person> participants) {
        this.payer = payer;
        this.name = name;
        this.amount = amount;
        this.createdDate = createdDate;
        this.participants = participants;
    }

    @ManyToOne(optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person payer;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "amount")
    private double amount;

    @Column(name = "created_date")
    private Timestamp createdDate;

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            })
    @JoinTable(name = "expense_person",
            joinColumns = {@JoinColumn(name = "expense_id")},
            inverseJoinColumns = {@JoinColumn(name = "person_id")})
    @EqualsAndHashCode.Exclude
    private Set<Person> participants = new HashSet<>();
}
