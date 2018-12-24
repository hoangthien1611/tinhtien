package com.mgmtp.internship.tntbe.repositories;

import com.mgmtp.internship.tntbe.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
}
