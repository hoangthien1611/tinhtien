package com.mgmtp.internship.tntbe.entities;

import lombok.Data;
import net.minidev.json.annotate.JsonIgnore;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @Column(name = "isActived")
    private boolean isActived;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "activity_id", nullable = false)
    @JsonIgnore
    private Activity activity;

    public Person(String name, boolean isActived, Activity activity) {
        this.name = name;
        this.isActived = isActived;
        this.activity = activity;
    }
}
