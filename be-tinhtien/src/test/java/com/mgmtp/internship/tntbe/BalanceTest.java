package com.mgmtp.internship.tntbe;

import com.mgmtp.internship.tntbe.dto.BalanceDTO;
import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.entities.Activity;
import com.mgmtp.internship.tntbe.entities.Expense;
import com.mgmtp.internship.tntbe.entities.Person;
import com.mgmtp.internship.tntbe.services.BalanceService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.sql.Timestamp;
import java.util.*;

import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BalanceTest {
    @Autowired
    private BalanceService balanceService;
    private List<Expense> expenses;
    private Timestamp currentTimestamp;
    private List<Person> personList;
    private Person person1;
    private Person person2;
    private Person person3;

    @Before
    public void initActivity() {
        expenses = new ArrayList<>();
        currentTimestamp = new Timestamp(new Date().getTime());
        Activity activity = new Activity();
        person1 = new Person("tri", true, activity);
        person2 = new Person("thien", true, activity);
        person3 = new Person("hoa", true, activity);
        personList = new ArrayList<>(Arrays.asList(person1, person2, person3));
    }

    @Test
    public void whenWeHaveNormalExpense() {
        //init data
        expenses.add(new Expense(person1, "com", 10d, currentTimestamp, new HashSet<>(Arrays.asList(person1, person2))));
        expenses.add(new Expense(person1, "ca", 12d, currentTimestamp, new HashSet<>(Arrays.asList(person2, person3))));

        List<BalanceDTO> actualBalanceDTOs = balanceService.getBalances(expenses, personList);

        //create expected result
        List<BalanceDTO> expectedBalanceDTOS = new ArrayList<>(Arrays.asList(
                new BalanceDTO(new PersonDTO(person1), 22, 5),
                new BalanceDTO(new PersonDTO(person2), 0, 11),
                new BalanceDTO(new PersonDTO(person3), 0, 6)));

        //compare
        assertThat(expectedBalanceDTOS, containsInAnyOrder(actualBalanceDTOs.toArray()));
    }

    @Test
    public void whenWeHavePersonNotInAnyExpense() {
        //init data
        expenses.add(new Expense(person1, "com", 10d, currentTimestamp, new HashSet<>(Arrays.asList(person1, person2))));

        List<BalanceDTO> actualBalanceDTOs = balanceService.getBalances(expenses, personList);

        //create expected result
        List<BalanceDTO> expectedBalanceDTOS = new ArrayList<>(Arrays.asList(
                new BalanceDTO(new PersonDTO(person1), 10, 5),
                new BalanceDTO(new PersonDTO(person2), 0, 5),
                new BalanceDTO(new PersonDTO(person3), 0, 0)));

        //compare
        assertThat(expectedBalanceDTOS, containsInAnyOrder(actualBalanceDTOs.toArray()));
    }
}
