package com.mgmtp.internship.tntbe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Entity
@Table(name = "person")
@NoArgsConstructor
public class Person {

    @Column(name = "id")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "active")
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonIgnore
    private Activity activity;

    public Person(String name, boolean active, Activity activity) {
        this.name = name;
        this.active = active;
        this.activity = activity;
    }

    @OneToMany(mappedBy = "payer")
    @JsonIgnore
    private List<Expense> paidExpenses;

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            },
            mappedBy = "participants")
    @JsonIgnore
    private Set<Expense> participatedExpenses = new HashSet<>();
}
