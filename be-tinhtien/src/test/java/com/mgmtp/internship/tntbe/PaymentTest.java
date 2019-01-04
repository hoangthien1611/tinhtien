package com.mgmtp.internship.tntbe;

import com.mgmtp.internship.tntbe.dto.ActivityDTO;
import com.mgmtp.internship.tntbe.dto.PaymentDTO;
import com.mgmtp.internship.tntbe.dto.PersonDTO;
import com.mgmtp.internship.tntbe.services.PaymentService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertThat;
import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PaymentTest {

    @Autowired
    private PaymentService paymentService;
    private ActivityDTO activity;
    private List<PersonDTO> persons;

    @Before
    public void initActivity() {
        persons = new ArrayList<>();
        activity = new ActivityDTO("Team building", "123456789", persons);
    }

    @Test
    public void whenWeHave1People() {
        // Init data
        persons.add(new PersonDTO(1L, "Hoa", true, 100));

        // Compare the actual number of transfers to pay money to each person with expect number of transfers
        assertThat(paymentService.getPayments(activity).size()).isEqualTo(0);
    }

    @Test
    public void whenWeHave2PeopleWithSameTotalExpense() {
        // Init data
        persons.add(new PersonDTO(1L, "Hoa", true, 100));
        persons.add(new PersonDTO(2L, "Mai", true, 100));
        activity.setPersons(persons);

        assertThat(paymentService.getPayments(activity).size()).isEqualTo(0);
    }

    @Test
    public void whenWeHave2PersonsWithDifferentTotalExpense() {
        // Init data
        PersonDTO person1 = new PersonDTO(1L, "Hoa", true, 100);
        PersonDTO person2 = new PersonDTO(2L, "Mai", true, 200);
        persons.addAll(Arrays.asList(person1, person2));

        List<PaymentDTO> actualPayments = paymentService.getPayments(activity);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>();
        expectedPayments.addAll(Arrays.asList(
                new PaymentDTO(person1, person2, 50)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave3PersonsWithDifferentTotalExpense() {
        // Init data
        PersonDTO person1 = new PersonDTO(1L, "Hoa", true, 300);
        PersonDTO person2 = new PersonDTO(2L, "Mai", true, 100);
        PersonDTO person3 = new PersonDTO(3L, "Dao", true, 50);
        persons.addAll(Arrays.asList(person1, person2, person3));


        List<PaymentDTO> actualPayments = paymentService.getPayments(activity);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>();
        expectedPayments.addAll(Arrays.asList(
                new PaymentDTO(person3, person1, 100),
                new PaymentDTO(person2, person1, 50)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave3PersonsWithSameTotalExpense() {
        // Init data
        persons.add(new PersonDTO(1L, "Hoa", true, 100));
        persons.add(new PersonDTO(2L, "Mai", true, 100));
        persons.add(new PersonDTO(3L, "Dao", true, 100));

        // Compare the actual number of transfers and expected number of transfers
        assertThat(paymentService.getPayments(activity).size()).isEqualTo(0);
    }

    @Test
    // When a activity have 4 people and they only need 2 transfer to pay money for each other
    public void whenWeHave4PersonsWith2PairPersons() {
        // Init data
        PersonDTO person1 = new PersonDTO(1L, "Mai", true, 80);
        PersonDTO person2 = new PersonDTO(2L, "Hoa", true, 120);
        PersonDTO person3 = new PersonDTO(3L, "Dao", true, 140);
        PersonDTO person4 = new PersonDTO(4L, "Cuc", true, 60);
        persons.addAll(Arrays.asList(person1, person2, person3, person4));

        List<PaymentDTO> actualPayments = paymentService.getPayments(activity);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>();
        expectedPayments.addAll(Arrays.asList(
                new PaymentDTO(person4, person3, 40),
                new PaymentDTO(person1, person2, 20)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave4Persons() {
        // Init data
        PersonDTO person1 = new PersonDTO(1L, "Mai", true, 170);
        PersonDTO person2 = new PersonDTO(2L, "Hoa", true, 225);
        PersonDTO person3 = new PersonDTO(3L, "Dao", true, 190);
        PersonDTO person4 = new PersonDTO(4L, "Cuc", true, 215);
        persons.addAll(Arrays.asList(person1, person2, person3, person4));

        List<PaymentDTO> actualPayments = paymentService.getPayments(activity);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>();
        expectedPayments.addAll(Arrays.asList(
                new PaymentDTO(person1, person2, 25),
                new PaymentDTO(person3, person4, 10),
                new PaymentDTO(person1, person4, 5)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave5PersonsWithHave1PairPersons() {
        // Init data
        PersonDTO person1 = new PersonDTO(1L, "Mai", true, 30);
        PersonDTO person2 = new PersonDTO(2L, "Hoa", true, 80);
        PersonDTO person3 = new PersonDTO(3L, "Dao", true, 20);
        PersonDTO person4 = new PersonDTO(4L, "Cuc", true, 60);
        PersonDTO person5 = new PersonDTO(5L, "Anh", true, 60);
        persons.addAll(Arrays.asList(person1, person2, person3, person4, person5));

        List<PaymentDTO> actualPayments = paymentService.getPayments(activity);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>();
        expectedPayments.addAll(Arrays.asList(
                new PaymentDTO(person3, person2, 30),
                new PaymentDTO(person1, person4, 10),
                new PaymentDTO(person1, person5, 10)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave5Persons() {
        // Init data
        PersonDTO person1 = new PersonDTO(1L, "Mai", true, 20);
        PersonDTO person2 = new PersonDTO(2L, "Hoa", true, 75);
        PersonDTO person3 = new PersonDTO(3L, "Dao", true, 8);
        PersonDTO person4 = new PersonDTO(4L, "Cuc", true, 12);
        PersonDTO person5 = new PersonDTO(5L, "Anh", true, 85);
        persons.addAll(Arrays.asList(person1, person2, person3, person4, person5));

        List<PaymentDTO> actualPayments = paymentService.getPayments(activity);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>();
        expectedPayments.addAll(Arrays.asList(
                new PaymentDTO(person3, person5, 32),
                new PaymentDTO(person4, person2, 28),
                new PaymentDTO(person1, person5, 13),
                new PaymentDTO(person1, person2, 7)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }
}