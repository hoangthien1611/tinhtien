package com.mgmtp.internship.tntbe.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;

@Data
@Entity
@Table
@NoArgsConstructor
public class Expenses {

    @Id
    private long id;

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id", nullable = false)
    @JsonIgnore
    private Person person;

    @Column
    private String name;

    @Column
    private long amount;

    @Column
    private Date createdDate;
}
