package com.mgmtp.internship.tntbe.repositories;

import com.mgmtp.internship.tntbe.entities.DummyPerson;
import com.mgmtp.internship.tntbe.entities.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    List<Expense> findAllByPersonIn(List<DummyPerson> dummyPersons);
}
