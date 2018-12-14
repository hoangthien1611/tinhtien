package com.mgmtp.internship.tntbe.entities;

import lombok.Data;
import javax.persistence.*;

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

}

