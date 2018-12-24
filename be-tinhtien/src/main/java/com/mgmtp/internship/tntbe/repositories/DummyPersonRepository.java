package com.mgmtp.internship.tntbe.repositories;

import com.mgmtp.internship.tntbe.entities.DummyPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DummyPersonRepository extends JpaRepository<DummyPerson,Long> {
    DummyPerson findAllById(long id);
}
