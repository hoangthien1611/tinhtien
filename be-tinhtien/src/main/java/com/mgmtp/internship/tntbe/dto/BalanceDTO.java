package com.mgmtp.internship.tntbe.dto;

import com.mgmtp.internship.tntbe.entities.Person;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BalanceDTO {
    private PersonDTO person;
    private double paid;
    private double shouldPay;

    public double getPayBack() {
        return paid - shouldPay;
    }
}
