package com.mgmtp.internship.tntbe.repositories;

import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.entities.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findAllByPayerInOrderByCreatedDateAsc(List<Person> people);

    List<Expense> findAllByPayer_Id(long id);

    List<Expense> findAllByParticipantsContains(Person person);
}
