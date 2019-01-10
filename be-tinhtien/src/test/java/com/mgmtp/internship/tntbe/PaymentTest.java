package com.mgmtp.internship.tntbe;

import com.mgmtp.internship.tntbe.dto.Balance;
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
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.collection.IsIterableContainingInAnyOrder.containsInAnyOrder;
import static org.junit.Assert.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PaymentTest {

    @Autowired
    private PaymentService paymentService;
    private List<Balance> balances;
    private PersonDTO person1;
    private PersonDTO person2;
    private PersonDTO person3;
    private PersonDTO person4;
    private PersonDTO person5;

    @Before
    public void initActivity() {
        balances = new ArrayList<>();
        person1 = new PersonDTO(1L, "Hoa", true);
        person2 = new PersonDTO(2L, "Mai", true);
        person3 = new PersonDTO(3L, "Dao", true);
        person4 = new PersonDTO(4L, "Cuc", true);
        person5 = new PersonDTO(5L, "Truc", true);
    }

    @Test
    public void whenWeHaveNoBalance() {
        // Compare the actual number of transfers to pay money to each person with expect number of transfers
        assertThat(paymentService.getPayments(balances).size()).isEqualTo(0);
    }

    @Test
    public void whenWeHave2Balances() {
        // Init data
        balances.add(new Balance(person1, -50d));
        balances.add(new Balance(person2, 50d));

        List<PaymentDTO> actualPayments = paymentService.getPayments(balances);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>(Collections.singletonList(
                new PaymentDTO(person1, person2, 50)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave3Balances() {
        // Init data
        balances.add(new Balance(person1, 150d));
        balances.add(new Balance(person2, -50d));
        balances.add(new Balance(person3, -100d));


        List<PaymentDTO> actualPayments = paymentService.getPayments(balances);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>(Arrays.asList(
                new PaymentDTO(person3, person1, 100),
                new PaymentDTO(person2, person1, 50)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    // When a activity have 4 people and they only need 2 transfer to pay money for each other
    public void whenWeHave4BalancesWith2Pair() {
        // Init data
        balances.add(new Balance(person1, -20d));
        balances.add(new Balance(person2, 20d));
        balances.add(new Balance(person3, 40d));
        balances.add(new Balance(person4, -40d));

        List<PaymentDTO> actualPayments = paymentService.getPayments(balances);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>(Arrays.asList(
                new PaymentDTO(person4, person3, 40),
                new PaymentDTO(person1, person2, 20)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave4Balances() {
        // Init data
        balances.add(new Balance(person1, -30d));
        balances.add(new Balance(person2, 25d));
        balances.add(new Balance(person3, -10d));
        balances.add(new Balance(person4, 15d));

        List<PaymentDTO> actualPayments = paymentService.getPayments(balances);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>(Arrays.asList(
                new PaymentDTO(person1, person2, 25),
                new PaymentDTO(person3, person4, 10),
                new PaymentDTO(person1, person4, 5)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave5BalancesWithHave1Pair() {
        // Init data
        balances.add(new Balance(person1, -20d));
        balances.add(new Balance(person2, 30d));
        balances.add(new Balance(person3, -30d));
        balances.add(new Balance(person4, 10d));
        balances.add(new Balance(person5, 10d));

        List<PaymentDTO> actualPayments = paymentService.getPayments(balances);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>(Arrays.asList(
                new PaymentDTO(person3, person2, 30),
                new PaymentDTO(person1, person4, 10),
                new PaymentDTO(person1, person5, 10)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }

    @Test
    public void whenWeHave5Balances() {
        // Init data
        balances.add(new Balance(person1, -20d));
        balances.add(new Balance(person2, 35d));
        balances.add(new Balance(person3, -32d));
        balances.add(new Balance(person4, -28d));
        balances.add(new Balance(person5, 45d));

        List<PaymentDTO> actualPayments = paymentService.getPayments(balances);

        // Create a expected list of payments
        List<PaymentDTO> expectedPayments = new ArrayList<>(Arrays.asList(
                new PaymentDTO(person3, person5, 32),
                new PaymentDTO(person4, person2, 28),
                new PaymentDTO(person1, person5, 13),
                new PaymentDTO(person1, person2, 7)
        ));

        // Compare the actual list of payments and expected list of payments without ordering
        assertThat(expectedPayments, containsInAnyOrder(actualPayments.toArray()));
    }
}