package com.mgmtp.internship.tntbe.repositories;

import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByPersonInOrderByCreatedDateAsc(List<Person> people);

    List<Expense> findAllByPerson_Id(long id);
}
